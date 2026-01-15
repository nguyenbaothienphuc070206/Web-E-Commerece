import { NextResponse } from "next/server"
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request)
    const rl = await rateLimit({ key: `notifications:post:${ip}`, limit: 10, windowMs: 60_000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      )
    }

    const body = await request.json()
    const { to, type, message } = body

    if (typeof to === "string" && to.length > 200) {
      return NextResponse.json({ success: false, error: "Invalid 'to'" }, { status: 400 })
    }
    if (typeof type === "string" && type.length > 50) {
      return NextResponse.json({ success: false, error: "Invalid 'type'" }, { status: 400 })
    }
    if (typeof message === "string" && message.length > 2000) {
      return NextResponse.json({ success: false, error: "Message too long" }, { status: 400 })
    }

    // This is a mock. Integrate with real email/SMS providers in production.
    return NextResponse.json({ success: true, data: { to, type, message } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}
