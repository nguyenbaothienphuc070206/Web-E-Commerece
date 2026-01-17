import { NextResponse } from "next/server"
import { getSessionUserFromCookies } from "@/lib/server/auth"
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit"
import { getSupabaseAdminClient, hasSupabaseServiceConfig } from "@/lib/server/supabase"

// This route provides a simple in-memory stock update wrapper around products mock.
// Note: Because the main products mock is a const in another module, this route will not
// actually mutate that module's exported array. For demo purposes we simply echo back the requested change.

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUserFromCookies()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const ip = getRequestIp(request)
    const rl = await rateLimit({ key: `products:stock:${ip}`, limit: 60, windowMs: 60_000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      )
    }

    const body = await request.json()
    const { productId, stock } = body
    if (!productId) return NextResponse.json({ success: false, error: "productId required" }, { status: 400 })

    if (typeof stock !== "number" || !Number.isFinite(stock) || stock < 0 || stock > 1_000_000) {
      return NextResponse.json({ success: false, error: "Invalid stock" }, { status: 400 })
    }

    if (hasSupabaseServiceConfig) {
      const supabase = getSupabaseAdminClient()
      const { data, error } = await supabase
        .from("products")
        .update({ stock, in_stock: stock > 0 })
        .eq("id", Number(productId))
        .select("id,stock,in_stock")
        .maybeSingle()

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      if (!data) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
      return NextResponse.json({ success: true, data: { productId: data.id, stock: data.stock, inStock: data.in_stock } })
    }

    // Demo fallback
    return NextResponse.json({ success: true, data: { productId, stock } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update stock" }, { status: 500 })
  }
}
