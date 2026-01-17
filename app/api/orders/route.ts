import { NextResponse } from "next/server"
import { getSessionUserFromCookies } from "@/lib/server/auth"
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit"
import { getSupabaseAdminClient, hasSupabaseServiceConfig } from "@/lib/server/supabase"
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "@/lib/server/order-notifications"

type Order = {
  id: number
  customer: any
  items: any[]
  subtotal?: number
  discount?: number
  shipping?: number
  total: number
  promoCode?: string | null
  paymentMethod: string
  status: string
  createdAt: string
}

// In-memory store for demo purposes. Resets on server restart.
const orders: Order[] = []

function mapDbOrder(row: any): Order {
  return {
    id: Number(row.id),
    customer: row.customer ?? {},
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: typeof row.subtotal === "number" ? row.subtotal : row.subtotal ? Number(row.subtotal) : 0,
    discount: typeof row.discount === "number" ? row.discount : row.discount ? Number(row.discount) : 0,
    shipping: typeof row.shipping === "number" ? row.shipping : row.shipping ? Number(row.shipping) : 0,
    total: typeof row.total === "number" ? row.total : row.total ? Number(row.total) : 0,
    promoCode: typeof row.promo_code === "string" ? row.promo_code : null,
    paymentMethod: typeof row.payment_method === "string" ? row.payment_method : "cod",
    status: typeof row.status === "string" ? row.status : "pending",
    createdAt: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
  }
}

function normalizeEmail(input: unknown) {
  return typeof input === "string" ? input.trim().toLowerCase() : ""
}

function isEmail(input: string) {
  if (!input || input.length > 200) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}

export async function GET() {
  const user = await getSessionUserFromCookies()
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  if (hasSupabaseServiceConfig) {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id,customer,items,subtotal,discount,shipping,total,promo_code,payment_method,status,created_at,updated_at,user_id",
      )
      .order("id", { ascending: false })
      .limit(500)

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data: (data || []).map(mapDbOrder) })
  }

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

    // Per-recipient anti-spam: cap how many orders can trigger emails to the same address.
    const customerEmail = normalizeEmail(body?.customer?.email)
    if (customerEmail && !isEmail(customerEmail)) {
      return NextResponse.json({ success: false, error: "Invalid customer email" }, { status: 400 })
    }
    if (customerEmail) {
      const rlEmail = await rateLimit({ key: `orders:create:email:${customerEmail}`, limit: 3, windowMs: 60 * 60_000 })
      if (!rlEmail.allowed) {
        return NextResponse.json({ success: false, error: "Too many orders for this email. Try again later." }, { status: 429 })
      }
    }

    const paymentMethod = body.paymentMethod || "cod"
    // Demo payment: treat non-COD as paid immediately.
    const status = paymentMethod === "cod" ? "pending" : "paid"

    if (hasSupabaseServiceConfig) {
      const sessionUser = await getSessionUserFromCookies().catch(() => null)
      const supabase = getSupabaseAdminClient()
      const insertRow: any = {
        user_id: sessionUser?.id ?? null,
        customer: body.customer || {},
        items: body.items,
        subtotal: body.subtotal || 0,
        discount: body.discount || 0,
        shipping: body.shipping || 0,
        total: body.total || 0,
        promo_code: body.promoCode || null,
        payment_method: paymentMethod,
        status,
      }

      const { data, error } = await supabase
        .from("orders")
        .insert([insertRow])
        .select(
          "id,customer,items,subtotal,discount,shipping,total,promo_code,payment_method,status,created_at,updated_at,user_id",
        )
        .single()

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

      const mapped = mapDbOrder(data)
      // Send a single professional confirmation email (real SMTP) from the server.
      // Do not fail the order if email sending fails.
      try {
        await sendOrderConfirmationEmail({
          ...mapped,
          customer: { ...(mapped.customer || {}), email: customerEmail || mapped.customer?.email },
          paymentMethod,
          status,
        })
      } catch {
        // ignore
      }

      return NextResponse.json({ success: true, data: mapped }, { status: 201 })
    }

    const id = orders.length + 1
    const order: Order = {
      id,
      customer: body.customer || {},
      items: body.items,
      subtotal: body.subtotal || 0,
      discount: body.discount || 0,
      shipping: body.shipping || 0,
      total: body.total || 0,
      promoCode: body.promoCode || null,
      paymentMethod,
      status,
      createdAt: new Date().toISOString(),
    }

    orders.push(order)

    try {
      await sendOrderConfirmationEmail({ ...order, customer: { ...(order.customer || {}), email: customerEmail || order.customer?.email } })
    } catch {
      // ignore
    }

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
    if (hasSupabaseServiceConfig) {
      const supabase = getSupabaseAdminClient()
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", Number(id))
        .select(
          "id,customer,items,subtotal,discount,shipping,total,promo_code,payment_method,status,created_at,updated_at,user_id",
        )
        .maybeSingle()

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      if (!data) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })

      const mapped = mapDbOrder(data)
      try {
        await sendOrderStatusEmail(mapped, status)
      } catch {
        // ignore
      }

      return NextResponse.json({ success: true, data: mapped })
    }

    const idx = orders.findIndex((o) => o.id === Number(id))
    if (idx === -1) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    orders[idx].status = status

    try {
      await sendOrderStatusEmail(orders[idx], status)
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, data: orders[idx] })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}
