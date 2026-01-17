import { NextResponse } from "next/server"
import { PRODUCTS } from "@/lib/constants"
import { getSessionUserFromCookies } from "@/lib/server/auth"
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit"
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  hasSupabasePublicConfig,
  hasSupabaseServiceConfig,
} from "@/lib/server/supabase"

const products = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  originalPrice: p.originalPrice,
  discount: p.discount,
  specs: p.specs,
  image: p.image,
  stock: p.inStock ? 10 : 0,
  rating: p.rating,
  reviews: p.reviews,
  description: p.description,
  brand: p.brand,
}))

function mapDbProduct(row: any) {
  const stock = typeof row?.stock === "number" ? row.stock : 0
  const inStock = typeof row?.in_stock === "boolean" ? row.in_stock : stock > 0

  return {
    id: Number(row.id),
    name: row.name,
    category: row.category,
    price: typeof row.price === "number" ? row.price : row.price ? Number(row.price) : 0,
    originalPrice:
      typeof row.original_price === "number" ? row.original_price : row.original_price ? Number(row.original_price) : undefined,
    discount: typeof row.discount === "number" ? row.discount : row.discount ? Number(row.discount) : undefined,
    specs: typeof row.specs === "string" ? row.specs : "",
    image: typeof row.image === "string" ? row.image : "",
    stock,
    rating: typeof row.rating === "number" ? row.rating : row.rating ? Number(row.rating) : undefined,
    reviews: typeof row.reviews === "number" ? row.reviews : row.reviews ? Number(row.reviews) : undefined,
    description: typeof row.description === "string" ? row.description : "",
    brand: typeof row.brand === "string" ? row.brand : "",
    inStock,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  // Prefer DB-backed products when Supabase is configured.
  // Recommended: use the admin client in server routes so the DB can stay locked down via RLS.
  if (hasSupabaseServiceConfig || hasSupabasePublicConfig) {
    const supabase = hasSupabaseServiceConfig ? getSupabaseAdminClient() : getSupabasePublicClient()
    let query = supabase
      .from("products")
      .select(
        "id,name,category,price,original_price,discount,specs,image,stock,rating,reviews,description,brand,in_stock",
      )
      .order("id", { ascending: true })
      .limit(500)

    if (category) query = query.eq("category", category)

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const mapped = (data || []).map(mapDbProduct)
    return NextResponse.json({ success: true, data: mapped, total: mapped.length })
  }

  let filteredProducts = products
  if (category) filteredProducts = products.filter((p) => p.category === category)

  return NextResponse.json({ success: true, data: filteredProducts, total: filteredProducts.length })
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUserFromCookies()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const ip = getRequestIp(request)
    const rl = await rateLimit({ key: `products:create:${ip}`, limit: 20, windowMs: 60_000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      )
    }

    const body = await request.json()

    // Basic payload caps
    if (typeof body?.name === "string" && body.name.length > 120) {
      return NextResponse.json({ success: false, error: "Invalid name" }, { status: 400 })
    }
    if (typeof body?.description === "string" && body.description.length > 2000) {
      return NextResponse.json({ success: false, error: "Description too long" }, { status: 400 })
    }

    // Validate product data
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Save to DB when configured, otherwise keep demo behavior.
    if (hasSupabaseServiceConfig) {
      const supabase = getSupabaseAdminClient()
      const insertRow: any = {
        name: body.name,
        description: body.description ?? null,
        specs: body.specs ?? null,
        price: body.price,
        original_price: body.originalPrice ?? null,
        discount: body.discount ?? null,
        image: body.image ?? null,
        category: body.category,
        brand: body.brand ?? null,
        stock: typeof body.stock === "number" ? Math.max(0, Math.floor(body.stock)) : 0,
        in_stock: typeof body.inStock === "boolean" ? body.inStock : true,
        rating: body.rating ?? null,
        reviews: body.reviews ?? null,
      }

      if (insertRow.stock > 0) insertRow.in_stock = true
      if (insertRow.stock === 0 && typeof body.inStock !== "boolean") insertRow.in_stock = false

      const { data, error } = await supabase
        .from("products")
        .insert([insertRow])
        .select(
          "id,name,category,price,original_price,discount,specs,image,stock,rating,reviews,description,brand,in_stock",
        )
        .single()

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, data: mapDbProduct(data) }, { status: 201 })
    }

    const newProduct = { id: products.length + 1, ...body, createdAt: new Date() }
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
