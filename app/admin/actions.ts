"use server"

import { createClient } from "@supabase/supabase-js"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getSessionUserFromCookies } from "@/lib/server/auth"

type ActionResult =
  | { success: true; message: string; inserted?: number }
  | { success: false; error: string }

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
}

function getGemini() {
  const geminiApiKey = process.env.GEMINI_API_KEY
  if (!geminiApiKey) throw new Error("Missing GEMINI_API_KEY")
  return new GoogleGenerativeAI(geminiApiKey)
}

async function tryInsertProductRow(row: any) {
  const supabase = getSupabaseAdmin()

  const fullAttempt = await supabase.from("products").insert([row])
  if (!fullAttempt.error) return fullAttempt

  // Fallback: some schemas may only have name/description/embedding.
  const { name, description, embedding } = row
  return supabase.from("products").insert([{ name, description, embedding }])
}

async function fetchImageAsInlineData(imageUrl: string): Promise<{ inlineData: { data: string; mimeType: string } } | null> {
  try {
    const url = new URL(imageUrl)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null

    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null

    const contentType = res.headers.get("content-type") || "application/octet-stream"
    // hard limit ~2MB to be safe
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length > 2_000_000) return null

    return {
      inlineData: {
        data: buf.toString("base64"),
        mimeType: contentType,
      },
    }
  } catch {
    return null
  }
}

export async function createProductAction(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const user = await getSessionUserFromCookies()
    if (!user || user.role !== "admin") return { success: false, error: "Unauthorized" }

    const name = String(formData.get("name") || "").trim()
    const descriptionInput = String(formData.get("description") || "").trim()
    const imageUrl = String(formData.get("imageUrl") || "").trim()
    const category = String(formData.get("category") || "").trim()
    const brand = String(formData.get("brand") || "").trim()
    const price = Number(formData.get("price") || 0)
    const autoDescribe = String(formData.get("autoDescribe") || "") === "on"

    if (!name) return { success: false, error: "Product name is required." }

    const genAI = getGemini()

    let description = descriptionInput
    if (!description && autoDescribe && imageUrl) {
      const imagePart = await fetchImageAsInlineData(imageUrl)
      if (imagePart) {
        const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const visionResult = await visionModel.generateContent([
          {
            text:
              "Describe the tech product in the image in English: 1–2 short sentences plus 3 bullet points highlighting key features. Do not invent precise specs if you are not sure.",
          },
          imagePart,
        ])
        description = visionResult.response.text().trim()
      }
    }

    if (!description) {
      description = "Genuine tech product with reliable quality."
    }

    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" })
    const embedText = [name, description, category && `Category: ${category}`, brand && `Brand: ${brand}`]
      .filter(Boolean)
      .join("\n")

    const embed = await embedModel.embedContent(embedText)
    const embedding = embed.embedding?.values
    if (!Array.isArray(embedding) || embedding.length === 0) {
      return { success: false, error: "Failed to generate an embedding." }
    }

    const row = {
      name,
      description,
      embedding,
      price: Number.isFinite(price) ? price : null,
      image: imageUrl || null,
      category: category || null,
      brand: brand || null,
      in_stock: true,
    }

    const { error } = await tryInsertProductRow(row)
    if (error) return { success: false, error: error.message }

    return { success: true, message: "Product and embedding saved to Supabase." }
  } catch (e: any) {
    return { success: false, error: e?.message || "Create product failed" }
  }
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export async function seedProductsAction(): Promise<ActionResult> {
  try {
    const user = await getSessionUserFromCookies()
    if (!user || user.role !== "admin") return { success: false, error: "Unauthorized" }

    const supabase = getSupabaseAdmin()
    
    // Fetch all products from Supabase that don't have embeddings
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .is("embedding", null)

    if (fetchError) {
      return { success: false, error: `Failed to fetch products: ${fetchError.message}` }
    }

    if (!products || products.length === 0) {
      return { success: true, message: "No products found without embeddings. All products are already processed.", inserted: 0 }
    }

    const genAI = getGemini()
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" })

    let updated = 0
    for (const group of chunk(products, 50)) {
      for (const p of group) {
        const embedText = [
          p.name,
          p.description,
          p.specs,
          p.category && `Category: ${p.category}`,
          p.brand && `Brand: ${p.brand}`,
        ]
          .filter(Boolean)
          .join("\n")

        const embed = await embedModel.embedContent(embedText)
        const embedding = embed.embedding?.values
        
        if (!Array.isArray(embedding) || embedding.length === 0) {
          console.warn(`Failed to generate embedding for product: ${p.name}`)
          continue
        }

        // Update the product with embedding
        const { error: updateError } = await supabase
          .from("products")
          .update({ embedding })
          .eq("id", p.id)

        if (updateError) {
          console.warn(`Failed to update product ${p.id}:`, updateError.message)
          continue
        }

        updated++
      }
    }

    return { success: true, message: `Generated embeddings for ${updated} products.`, inserted: updated }
  } catch (e: any) {
    return { success: false, error: e?.message || "Seed failed" }
  }
}
