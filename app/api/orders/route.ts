import { NextResponse } from "next/server"

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
  return NextResponse.json({ success: true, data: orders })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || !body.items) return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 })

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
    const body = await request.json()
    const { id, status } = body
    const idx = orders.findIndex((o) => o.id === Number(id))
    if (idx === -1) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    orders[idx].status = status
    return NextResponse.json({ success: true, data: orders[idx] })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}
