import { NextResponse } from "next/server"
import { PRODUCTS } from "@/lib/constants"
import { getSessionUserFromCookies } from "@/lib/server/auth"
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit"

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  let filteredProducts = products

  if (category) {
    filteredProducts = products.filter((p) => p.category === category)
  }

  return NextResponse.json({
    success: true,
    data: filteredProducts,
    total: filteredProducts.length,
  })
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

    // In a real app, save to database
    const newProduct = {
      id: products.length + 1,
      ...body,
      createdAt: new Date(),
    }

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
