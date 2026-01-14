import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCTS } from "@/lib/constants";

function getAdminSecretFromRequest(req: Request): string {
  const headerSecret = req.headers.get("x-admin-secret");
  if (headerSecret) return headerSecret;

  // Optional fallback: allow passing via query string for quick manual calls
  // (still protected by the same server-side env secret)
  try {
    const url = new URL(req.url);
    return url.searchParams.get("secret") || "";
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const adminSeedSecret = process.env.ADMIN_SEED_SECRET;
    const providedSecret = getAdminSecretFromRequest(req);

    if (!adminSeedSecret) {
      return NextResponse.json(
        { error: "Thiếu ADMIN_SEED_SECRET trong .env.local (để bảo vệ endpoint seed)." },
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
        { error: "Thiếu cấu hình Supabase (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." },
        { status: 500 }
      );
    }

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Thiếu GEMINI_API_KEY." },
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
          { error: `Không tạo được embedding cho: ${p.name}` },
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
