import { NextResponse } from "next/server"

// Mock product data - replace with database queries
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "phone",
    price: 29990000,
    originalPrice: 38000000,
    discount: 18,
    specs: "256GB - Titan từ Hàng",
    image: "/placeholder.svg?height=250&width=200",
    rating: 4.8,
    reviews: 245,
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    category: "laptop",
    price: 65990000,
    originalPrice: 75000000,
    discount: 12,
    specs: "M3 Pro, 512GB SSD",
    image: "/placeholder.svg?height=250&width=200",
    rating: 4.9,
    reviews: 189,
  },
  {
    id: 3,
    name: "AirPods Pro (Gen 3)",
    category: "airpod",
    price: 6490000,
    originalPrice: 7500000,
    discount: 13,
    specs: "Chống ồn chủ động",
    image: "/placeholder.svg?height=250&width=200",
    rating: 4.7,
    reviews: 512,
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra",
    category: "phone",
    price: 33990000,
    originalPrice: 40000000,
    discount: 15,
    specs: "512GB - Titan Gray",
    image: "/placeholder.svg?height=250&width=200",
    rating: 4.8,
    reviews: 378,
  },
]

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
