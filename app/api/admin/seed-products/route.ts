import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCTS } from "@/lib/constants";
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit";

function getAdminSecretFromRequest(req: Request): string {
  const headerSecret = req.headers.get("x-admin-secret");
  if (headerSecret) return headerSecret;

  // Intentionally do not accept secrets via query params (leaks via logs/referrers).
  return "";
}

export async function POST(req: Request) {
  try {
    const ip = getRequestIp(req);
    const rl = await rateLimit({ key: `admin:seed-products:${ip}`, limit: 2, windowMs: 60 * 60_000 });
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const adminSeedSecret = process.env.ADMIN_SEED_SECRET;
    const providedSecret = getAdminSecretFromRequest(req);

    if (!adminSeedSecret) {
      return NextResponse.json(
        { error: "Missing ADMIN_SEED_SECRET. Set it in your server environment to protect this endpoint." },
        { status: 500 }
      );
    }

    if (providedSecret !== adminSeedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." },
        { status: 500 }
      );
    }

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // Keep schema assumptions minimal: insert only fields we know exist from your test page.
    // (name, description, embedding)
    const inserts: Array<{ name: string; description: string; embedding: number[] }> = [];

    for (const p of PRODUCTS) {
      const text = [
        p.name,
        p.description,
        p.specs,
        `Category: ${p.category}`,
        `Brand: ${p.brand}`,
      ]
        .filter(Boolean)
        .join("\n");

      const result = await model.embedContent(text);
      const embedding = result.embedding?.values;
      if (!Array.isArray(embedding) || embedding.length === 0) {
        return NextResponse.json(
          { error: `Failed to create an embedding for: ${p.name}` },
          { status: 502 }
        );
      }

      inserts.push({
        name: p.name,
        description: p.description,
        embedding,
      });
    }

    const { error } = await supabase.from("products").insert(inserts);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, inserted: inserts.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Seed failed" }, { status: 500 });
  }
}
