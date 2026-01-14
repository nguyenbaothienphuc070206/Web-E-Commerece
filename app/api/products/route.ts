import { NextResponse } from "next/server"
import { PRODUCTS } from "@/lib/constants"

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
    const body = await request.json()

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
