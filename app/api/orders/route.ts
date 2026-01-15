import { NextResponse } from "next/server"
import { getSessionUserFromCookies } from "@/lib/server/auth"
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit"

type Order = {
  id: number
  customer: any
  items: any[]
  total: number
  paymentMethod: string
  status: string
  createdAt: string
}

// In-memory store for demo purposes. Resets on server restart.
const orders: Order[] = []

export async function GET() {
  const user = await getSessionUserFromCookies()
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
  return NextResponse.json({ success: true, data: orders })
}

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request)
    const rl = await rateLimit({ key: `orders:create:${ip}`, limit: 15, windowMs: 60_000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      )
    }

    const body = await request.json()
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 })
    }

    if (body.items.length === 0 || body.items.length > 100) {
      return NextResponse.json({ success: false, error: "Invalid items" }, { status: 400 })
    }

    if (body.customer && JSON.stringify(body.customer).length > 10_000) {
      return NextResponse.json({ success: false, error: "Customer payload too large" }, { status: 400 })
    }

    const id = orders.length + 1
    const order: Order = {
      id,
      customer: body.customer || {},
      items: body.items,
      total: body.total || 0,
      paymentMethod: body.paymentMethod || "cod",
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(order)

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUserFromCookies()
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const { id, status } = body
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 })
    if (typeof status !== "string" || status.length > 40) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }
    const idx = orders.findIndex((o) => o.id === Number(id))
    if (idx === -1) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    orders[idx].status = status
    return NextResponse.json({ success: true, data: orders[idx] })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}
