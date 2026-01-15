import { NextResponse } from "next/server"

// Mock cart data - in production, use sessions/database
const carts = new Map()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cartId = searchParams.get("id") || "default"

  const cart = carts.get(cartId) || { items: [], total: 0 }

  return NextResponse.json({
    success: true,
    data: cart,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cartId = body.cartId || "default"

    const cart = carts.get(cartId) || { items: [], total: 0 }

    // Add item to cart
    const existingItem = cart.items.find((item: any) => item.id === body.productId)

    if (existingItem) {
      existingItem.quantity += body.quantity || 1
    } else {
      cart.items.push({
        id: body.productId,
        name: body.name,
        price: body.price,
        quantity: body.quantity || 1,
      })
    }

    // Recalculate total
    cart.total = cart.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    carts.set(cartId, cart)

    return NextResponse.json({ success: true, data: cart }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add to cart" }, { status: 500 })
  }
}
