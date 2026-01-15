import { NextResponse } from "next/server"
import { getSessionUserFromCookies } from "@/lib/server/auth"
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit"

// Mock cart data - in production, use sessions/database
const carts = new Map()

function normalizeCartId(input: unknown): string {
  const raw = typeof input === "string" ? input : ""
  const trimmed = raw.trim()
  if (!trimmed) return "default"
  // Keep cart id reasonably small and safe for map keys
  if (trimmed.length > 64) return "default"
  if (!/^[a-zA-Z0-9:_-]+$/.test(trimmed)) return "default"
  return trimmed
}

export async function GET(request: Request) {
  const ip = getRequestIp(request)
  const rl = await rateLimit({ key: `cart:get:${ip}`, limit: 120, windowMs: 60_000 })
  if (!rl.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    )
  }

  const user = await getSessionUserFromCookies()
  const { searchParams } = new URL(request.url)
  const cartId = user ? `user:${user.id}` : normalizeCartId(searchParams.get("id"))

  const cart = carts.get(cartId) || { items: [], total: 0 }

  return NextResponse.json({
    success: true,
    data: cart,
  })
}

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request)
    const rl = await rateLimit({ key: `cart:post:${ip}`, limit: 60, windowMs: 60_000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      )
    }

    const body = await request.json()
    const user = await getSessionUserFromCookies()
    const cartId = user ? `user:${user.id}` : normalizeCartId(body?.cartId)

    const cart = carts.get(cartId) || { items: [], total: 0 }

    // Add item to cart
    const existingItem = cart.items.find((item: any) => item.id === body.productId)

    if (!body?.productId) {
      return NextResponse.json({ success: false, error: "productId required" }, { status: 400 })
    }
    if (typeof body?.name !== "string" || body.name.length === 0 || body.name.length > 200) {
      return NextResponse.json({ success: false, error: "Invalid name" }, { status: 400 })
    }
    if (typeof body?.price !== "number" || !Number.isFinite(body.price) || body.price < 0 || body.price > 1_000_000_000) {
      return NextResponse.json({ success: false, error: "Invalid price" }, { status: 400 })
    }
    const qty = typeof body?.quantity === "number" ? body.quantity : 1
    const safeQty = Number.isFinite(qty) ? Math.max(1, Math.min(999, Math.floor(qty))) : 1

    if (existingItem) {
      existingItem.quantity += safeQty
    } else {
      cart.items.push({
        id: body.productId,
        name: body.name,
        price: body.price,
        quantity: safeQty,
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
