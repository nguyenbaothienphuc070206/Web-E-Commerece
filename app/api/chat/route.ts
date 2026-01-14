import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TTLCache } from "@/lib/server/ttl-cache";
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const chatCache = new TTLCache<string, any>(30_000, 200);

function normalizeText(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function escapeForIlikeTerm(term: string) {
  return term.replace(/[%_,]/g, " ").replace(/\s+/g, " ").trim();
}

function expandQueryTerms(query: string) {
  const q = normalizeText(query).toLowerCase();
  const terms = new Set<string>();
  if (q) terms.add(q);
  const add = (...xs: string[]) => xs.forEach((x) => x && terms.add(x));

  if (q.includes("tai nghe")) add("headphone", "headphones", "earbuds", "in-ear", "over-ear");
  if (q.includes("chống ồn") || q.includes("chong on")) add("noise cancelling", "noise canceling", "anc");
  if (q.includes("loa")) add("speaker", "speakers", "bluetooth speaker");
  if (q.includes("bàn phím") || q.includes("ban phim")) add("keyboard", "mechanical keyboard");
  if (q.includes("chuột") || q.includes("chuot")) add("mouse", "wireless mouse");
  if (q.includes("màn hình") || q.includes("man hinh")) add("monitor", "display", "4k monitor");
  if (q.includes("laptop")) add("notebook", "ultrabook");
  if (q.includes("điện thoại") || q.includes("dien thoai")) add("phone", "smartphone");
  if (q.includes("máy tính bảng") || q.includes("may tinh bang")) add("tablet", "ipad");
  if (q.includes("pin dự phòng") || q.includes("pin du phong")) add("power bank", "powerbank");
  if (q.includes("sạc") || q.includes("sac")) add("charger", "charging");

  for (const token of q.split(" ")) {
    const t = token.trim();
    if (t.length >= 2) terms.add(t);
  }

  return Array.from(terms).slice(0, 8);
}

function getSimilarity(row: any) {
  const candidates = [row?.similarity, row?.score, row?._similarity, row?._score];
  for (const v of candidates) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return 0;
}

function computeKeywordScore(row: any, terms: string[]) {
  const name = String(row?.name ?? "").toLowerCase();
  const desc = String(row?.description ?? "").toLowerCase();
  let score = 0;
  for (const term of terms) {
    const t = term.toLowerCase();
    if (!t) continue;
    if (name.includes(t)) score += 5;
    if (desc.includes(t)) score += 2;
  }
  return score;
}

function stripLongDashes(text: string) {
  return text.replace(/[—–]/g, "-");
}

function getChatModelCandidates() {
  const fromEnv = normalizeText(process.env.GEMINI_CHAT_MODEL ?? "");
  const candidates = [
    fromEnv,
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-latest",
    "gemini-1.0-pro",
  ].filter(Boolean);

  return Array.from(new Set(candidates));
}

async function generateWithFallback(
  genAI: GoogleGenerativeAI,
  prompt: string
): Promise<{ model: string; text: string }> {
  const candidates = getChatModelCandidates();
  let lastError: any = null;

  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const gen = await model.generateContent(prompt);
      const text = gen.response.text().trim();
      return { model: modelName, text };
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message ?? "");

      // If we're quota-limited, switching models will not help.
      const status = typeof err?.status === "number" ? err.status : undefined;
      if (status === 429 || msg.toLowerCase().includes("quota")) {
        throw err;
      }

      // Retry on model-not-found / unsupported method errors.
      if (msg.includes("models/") && (msg.includes("not found") || msg.includes("not supported"))) {
        continue;
      }
      // For other errors, bail out immediately.
      throw err;
    }
  }

  throw lastError ?? new Error("Gemini generateContent failed");
}

export async function POST(req: Request) {
  let retrievedProducts: any[] = [];
  let retrievalMeta: { keywordCount: number; vectorCount: number; embedModel: string } | null = null;

  try {
    const ip = getRequestIp(req);
    const rl = await rateLimit({ key: `chat:${ip}`, limit: 15, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again shortly." },
        { status: 429, headers: { "x-ratelimit-reset": String(rl.resetAt) } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === "string" ? normalizeText(body.message) : "";
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const cacheKey = JSON.stringify({ message, history: history.slice(-6) });
    const cached = chatCache.get(cacheKey);
    if (cached) return NextResponse.json({ ...cached, cached: true });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY. Configure it in the Next app .env.local." },
        { status: 500 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Retrieval (hybrid): keyword + vector
    const q = message;
    const expandedTerms = expandQueryTerms(q);
    const keywordLikes = expandedTerms
      .map(escapeForIlikeTerm)
      .filter(Boolean)
      .map((t) => `%${t}%`);

    const orParts: string[] = [];
    for (const like of keywordLikes) {
      orParts.push(`name.ilike.${like}`, `description.ilike.${like}`);
    }
    const keywordOr = orParts.join(",");

    const keywordPromise = supabase
      .from("products")
      .select("*")
      .or(keywordOr)
      .limit(8);

    const embedModelName = normalizeText(process.env.GEMINI_EMBED_MODEL ?? "text-embedding-004") || "text-embedding-004";
    const embedModel = genAI.getGenerativeModel({ model: embedModelName });
    const embedResult = await embedModel.embedContent(q);
    const embedding = embedResult.embedding?.values;

    if (!Array.isArray(embedding) || embedding.length === 0) {
      return NextResponse.json(
        { error: "Failed to create an embedding. Please try a different message." },
        { status: 502 }
      );
    }

    const vectorPromise = supabase.rpc("match_products", {
      query_embedding: embedding,
      match_threshold: 0.25,
      match_count: 8,
    });

    const [{ data: keywordRows, error: keywordError }, { data: vectorRows, error: vectorError }] =
      await Promise.all([keywordPromise, vectorPromise]);

    if (keywordError) console.warn("Chat keyword search error:", keywordError.message);
    if (vectorError) {
      console.error("Chat vector search error:", vectorError);
      return NextResponse.json({ error: vectorError.message }, { status: 500 });
    }

    const merged = new Map<string, any>();
    for (const row of (vectorRows as any[]) || []) {
      const key = String(row.id ?? row.name ?? JSON.stringify(row));
      merged.set(key, { ...row, _source: "vector" });
    }
    for (const row of (keywordRows as any[]) || []) {
      const key = String(row.id ?? row.name ?? JSON.stringify(row));
      if (!merged.has(key)) merged.set(key, { ...row, _source: "keyword" });
    }

    const products = Array.from(merged.values())
      .sort((a, b) => {
        const kwA = computeKeywordScore(a, expandedTerms);
        const kwB = computeKeywordScore(b, expandedTerms);
        if (kwA !== kwB) return kwB - kwA;
        return getSimilarity(b) - getSimilarity(a);
      })
      .slice(0, 8);

    retrievedProducts = products;
    retrievalMeta = {
      keywordCount: (keywordRows as any[])?.length ?? 0,
      vectorCount: (vectorRows as any[])?.length ?? 0,
      embedModel: embedModelName,
    };

    // Generation

    const historyText = history
      .slice(-6)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${normalizeText(m.content ?? "")}`)
      .join("\n");

    const productContext = products
      .map((p: any, idx: number) => {
        const name = p?.name ?? "";
        const price = typeof p?.price === "number" ? p.price : undefined;
        const brand = p?.brand ? String(p.brand) : "";
        const category = p?.category ? String(p.category) : "";
        const desc = p?.description ? String(p.description) : "";
        const url = p?.imageUrl ? String(p.imageUrl) : p?.image ? String(p.image) : "";

        const parts = [
          `#${idx + 1}: ${name}`,
          brand ? `brand: ${brand}` : null,
          category ? `category: ${category}` : null,
          typeof price === "number" ? `price: ${price}` : null,
          desc ? `description: ${desc}` : null,
          url ? `image: ${url}` : null,
        ].filter(Boolean);

        return parts.join("\n");
      })
      .join("\n\n---\n\n");

    const prompt = stripLongDashes(
      [
        "You are a shopping assistant for an e-commerce website.",
        "You must ONLY recommend items from CONTEXT PRODUCTS. If nothing fits, say you could not find a matching product and ask ONE short follow-up question.",
        "Answer in English. Keep it concise. Prefer 2-4 options and one sentence of justification per option.",
        "\nCONTEXT PRODUCTS:\n" + (productContext || "(empty)"),
        historyText ? "\nCHAT HISTORY:\n" + historyText : "",
        `\nUSER: ${q}`,
      ]
        .filter(Boolean)
        .join("\n\n")
    );

    const genOut = await generateWithFallback(genAI, prompt);
    const answer = genOut.text;

    const payload = {
      answer,
      products,
      meta: {
        returned: products.length,
        keywordCount: retrievalMeta?.keywordCount ?? 0,
        vectorCount: retrievalMeta?.vectorCount ?? 0,
        model: genOut.model,
        embedModel: retrievalMeta?.embedModel ?? embedModelName,
      },
    };

    chatCache.set(cacheKey, payload);

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Chat route error:", error);

    const status = typeof error?.status === "number" ? error.status : undefined;
    const message = String(error?.message ?? "Server error");
    const lower = message.toLowerCase();

    if (status === 429 || lower.includes("quota") || lower.includes("rate limit")) {
      // Graceful fallback: return a non-generative answer + retrieved products.
      return NextResponse.json(
        {
          answer:
            "AI generation is temporarily unavailable due to Gemini quota/rate limits. Showing the best matching products instead.",
          products: retrievedProducts,
          meta: {
            fallback: true,
            reason: "gemini_quota_or_rate_limit",
            returned: retrievedProducts.length,
            keywordCount: retrievalMeta?.keywordCount ?? 0,
            vectorCount: retrievalMeta?.vectorCount ?? 0,
            embedModel: retrievalMeta?.embedModel ?? null,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
