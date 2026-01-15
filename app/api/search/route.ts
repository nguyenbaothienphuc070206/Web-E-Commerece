import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { TTLCache } from "@/lib/server/ttl-cache";
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit";

type SearchFilters = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
};

const searchCache = new TTLCache<string, any>(30_000, 300);

function normalizeText(input: string) {
  return input.replace(/\s+/g, ' ').trim();
}

function normalizeForMatching(input: string) {
  return normalizeText(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g, 'd')
    .replace(/\u0110/g, 'd');
}

function escapeForIlikeTerm(term: string) {
  // Build a safe PostgREST filter snippet by stripping punctuation that could
  // break the `.or()` CSV filter syntax. Keep letters/numbers/spaces/hyphens.
  return term
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

function expandQueryTerms(query: string) {
  const q = normalizeForMatching(query);
  const terms = new Set<string>();
  if (q) terms.add(q);

  const add = (...xs: string[]) => xs.forEach((x) => x && terms.add(x));

  // Keep this English-only; vector search still works well for other languages.
  if (q.includes('headphone') || q.includes('earbud')) add('headphone', 'headphones', 'earbuds', 'in-ear', 'over-ear');
  if (q.includes('noise cancel') || q.includes('anc')) add('noise cancelling', 'noise canceling', 'anc');
  if (q.includes('speaker')) add('speaker', 'speakers', 'bluetooth speaker');
  if (q.includes('keyboard')) add('keyboard', 'mechanical keyboard');
  if (q.includes('mouse')) add('mouse', 'wireless mouse');
  if (q.includes('monitor') || q.includes('display')) add('monitor', 'display', '4k monitor');
  if (q.includes('laptop') || q.includes('notebook') || q.includes('ultrabook')) add('laptop', 'notebook', 'ultrabook');
  if (q.includes('phone') || q.includes('smartphone')) add('phone', 'smartphone');
  if (q.includes('tablet') || q.includes('ipad')) add('tablet', 'ipad');
  if (q.includes('power bank') || q.includes('powerbank')) add('power bank', 'powerbank');
  if (q.includes('charger') || q.includes('charging')) add('charger', 'charging');

  // Also break into tokens to help partial matching.
  for (const token of q.split(' ')) {
    const t = token.trim();
    if (t.length >= 2) terms.add(t);
  }

  return Array.from(terms).slice(0, 8); // keep OR string bounded
}

function getSimilarity(row: any) {
  const candidates = [row?.similarity, row?.score, row?._similarity, row?._score];
  for (const v of candidates) {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return 0;
}

function computeKeywordScore(row: any, terms: string[]) {
  const name = String(row?.name ?? '').toLowerCase();
  const desc = String(row?.description ?? '').toLowerCase();
  let score = 0;
  for (const term of terms) {
    const t = term.toLowerCase();
    if (!t) continue;
    if (name.includes(t)) score += 5;
    if (desc.includes(t)) score += 2;
  }
  return score;
}

type Intent =
  | "headphones"
  | "phone"
  | "camera"
  | "laptop"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "speaker"
  | null;

function inferIntent(query: string): Intent {
  const q = normalizeForMatching(query);
  if (!q) return null;

  if (q.includes("headphone") || q.includes("earbud")) return "headphones";
  if (q.includes("iphone") || q.includes("smartphone") || q.includes("phone")) return "phone";
  if (q.includes("camera") || q.includes("gopro") || q.includes("dslr")) return "camera";
  if (q.includes("laptop") || q.includes("notebook") || q.includes("macbook") || q.includes("ultrabook")) return "laptop";
  if (q.includes("monitor") || q.includes("display")) return "monitor";
  if (q.includes("keyboard")) return "keyboard";
  if (q.includes("mouse")) return "mouse";
  if (q.includes("speaker")) return "speaker";

  return null;
}

function matchesIntent(product: any, intent: Intent) {
  if (!intent) return true;
  const name = String(product?.name ?? "").toLowerCase();
  const desc = String(product?.description ?? "").toLowerCase();
  const cat = String(product?.category ?? "").toLowerCase();
  const brand = String(product?.brand ?? "").toLowerCase();
  const hay = `${name} ${desc} ${cat} ${brand}`;

  const hasAny = (xs: string[]) => xs.some((x) => hay.includes(x));

  switch (intent) {
    case "headphones":
      // Avoid obvious mismatches.
      if (
        hasAny([
          "watch",
          "smartwatch",
          "apple watch",
          "iphone",
          "phone",
          "smartphone",
          "camera",
          "gopro",
          "dslr",
          "mirrorless",
        ])
      ) {
        return false;
      }

      // Require at least one positive headphone signal.
      const positive = [
        "headphone",
        "headphones",
        "earbud",
        "earbuds",
        "over-ear",
        "in-ear",
        "anc",
        "noise cancel",
        "noise-cancel",
      ];

      const matchesNameOrDesc = positive.some((t) => name.includes(t) || desc.includes(t));
      const matchesCategory = ["audio", "headphone", "headphones", "earbud", "earbuds"].some((t) => cat.includes(t));

      return matchesNameOrDesc || matchesCategory;
    case "phone":
      return hasAny(["phone", "smartphone", "iphone", "android", "samsung", "pixel"]);
    case "camera":
      return hasAny(["camera", "gopro", "dslr", "mirrorless", "lens"]);
    case "laptop":
      return hasAny(["laptop", "notebook", "macbook", "ultrabook", "thinkpad", "xps"]);
    case "monitor":
      return hasAny(["monitor", "display", "4k"]);
    case "keyboard":
      return hasAny(["keyboard", "mechanical", "switch"]);
    case "mouse":
      return hasAny(["mouse", "dpi", "wireless"]);
    case "speaker":
      return hasAny(["speaker", "bluetooth", "soundbar"]);
    default:
      return true;
  }
}

export async function POST(req: Request) {
  try {
    const ip = getRequestIp(req);
    const rl = await rateLimit({ key: `search:${ip}`, limit: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again shortly.' },
        { status: 429, headers: { 'x-ratelimit-reset': String(rl.resetAt) } }
      );
    }

    // Receive query from the client
    const body = await req.json().catch(() => ({}));
    const query = typeof body?.query === 'string' ? body.query.trim() : '';

    const filters: SearchFilters = {
      category: typeof body?.category === 'string' ? body.category.trim() : undefined,
      brand: typeof body?.brand === 'string' ? body.brand.trim() : undefined,
      minPrice: typeof body?.minPrice === 'number' ? body.minPrice : undefined,
      maxPrice: typeof body?.maxPrice === 'number' ? body.maxPrice : undefined,
    };

    if (!query) {
      return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
    }

    if (query.length > 300) {
      return NextResponse.json({ error: 'Query is too long' }, { status: 400 });
    }

    const cacheKey = JSON.stringify({ query, filters });
    const cached = searchCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).' },
        { status: 500 }
      );
    }

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'Missing GEMINI_API_KEY. Configure it in the Next app .env.local.' },
        { status: 500 }
      );
    }

    // 1) Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    // 2) Initialize Supabase (anon key; do NOT use service role on public endpoints)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    // Hybrid search:
    // 1) Keyword search: literal terms (iphone 15, macbook...)
    // 2) Vector search: semantic intent

    const q = normalizeText(query);
    const expandedTerms = expandQueryTerms(q);
    const keywordLikes = expandedTerms
      .map(escapeForIlikeTerm)
      .filter(Boolean)
      .map((t) => `%${t}%`);

    const orParts: string[] = [];
    for (const like of keywordLikes) {
      // NOTE: PostgREST "or" uses comma-separated filters.
      orParts.push(`name.ilike.${like}`, `description.ilike.${like}`);
    }
    const keywordOr = orParts.join(',');

    const keywordPromise = supabase
      .from('products')
      .select('*')
      .or(keywordOr)
      .limit(10);

    // Vector embedding
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embedResult = await embedModel.embedContent(q);
    const embedding = embedResult.embedding?.values;
    if (!Array.isArray(embedding) || embedding.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create an embedding. Please try a different query.' },
        { status: 502 }
      );
    }

    const vectorPromise = supabase
      .rpc('match_products', {
        query_embedding: embedding,
        match_threshold: 0.25,
        match_count: 10,
      })
      .then(
        (res) => res,
        (e: any) => ({ data: null, error: { message: String(e?.message ?? e ?? "Vector RPC failed") } })
      );

    const [{ data: keywordRows, error: keywordError }, { data: vectorRows, error: vectorError }] = await Promise.all([
      keywordPromise,
      vectorPromise as any,
    ]);

    if (keywordError) console.warn('Keyword search error:', keywordError.message);
    if (vectorError) {
      // Common on locked-down DBs with RLS: RPC denied. Fall back to keyword-only.
      console.warn('Vector search unavailable (falling back to keyword-only):', vectorError.message);
    }

    const merged = new Map<string, any>();

    // Prefer vector results first (often include similarity)
    for (const row of (vectorRows as any[]) || []) {
      const key = String(row.id ?? row.name ?? JSON.stringify(row));
      merged.set(key, { ...row, _source: 'vector' });
    }

    for (const row of (keywordRows as any[]) || []) {
      const key = String(row.id ?? row.name ?? JSON.stringify(row));
      if (!merged.has(key)) merged.set(key, { ...row, _source: 'keyword' });
    }

    let products = Array.from(merged.values());

    // Rank: keyword match score first, then vector similarity.
    products.sort((a, b) => {
      const kwA = computeKeywordScore(a, expandedTerms);
      const kwB = computeKeywordScore(b, expandedTerms);
      if (kwA !== kwB) return kwB - kwA;
      return getSimilarity(b) - getSimilarity(a);
    });

    // Intent filtering: if user clearly asks for a product type, prefer matching items.
    const intent = inferIntent(q);
    if (intent) {
      const intended = products.filter((p) => matchesIntent(p, intent));
      if (intended.length > 0) products = intended;
    }

    // Metadata filtering (best-effort; depends on DB columns)
    if (filters.category) {
      products = products.filter((p) => String(p.category || '').toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.brand) {
      products = products.filter((p) => String(p.brand || '').toLowerCase() === filters.brand!.toLowerCase());
    }
    if (typeof filters.minPrice === 'number') {
      products = products.filter((p) => typeof p.price === 'number' && p.price >= filters.minPrice!);
    }
    if (typeof filters.maxPrice === 'number') {
      products = products.filter((p) => typeof p.price === 'number' && p.price <= filters.maxPrice!);
    }

    // Cache + return
    const payload = {
      products,
      meta: {
        query: q,
        keywordCount: (keywordRows as any[])?.length ?? 0,
        vectorCount: (vectorRows as any[])?.length ?? 0,
        returned: products.length,
      },
    };
    searchCache.set(cacheKey, payload);

    // (Optional) analytics: best-effort log, ignore failures
    try {
      await supabase.from('search_logs').insert([{ query: q, returned: products.length }]);
    } catch {}

    return NextResponse.json(payload);

  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error?.message ?? 'Server error' }, { status: 500 });
  }
}