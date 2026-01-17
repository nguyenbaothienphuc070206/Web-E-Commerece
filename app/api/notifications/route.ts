import { NextResponse } from "next/server"
import { getSessionUserFromCookies } from "@/lib/server/auth"
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit"
import { hasSmtpConfig, sendEmail } from "@/lib/server/email"

function isEmail(input: unknown) {
  if (typeof input !== "string") return false
  const s = input.trim()
  if (!s || s.length > 200) return false
  // basic, safe email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUserFromCookies()
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

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
    const { to, type, message, subject } = body

    if (!isEmail(to)) {
      return NextResponse.json({ success: false, error: "Invalid email recipient" }, { status: 400 })
    }
    if (typeof type === "string" && type.length > 50) {
      return NextResponse.json({ success: false, error: "Invalid 'type'" }, { status: 400 })
    }
    if (typeof message === "string" && message.length > 2000) {
      return NextResponse.json({ success: false, error: "Message too long" }, { status: 400 })
    }

    if (!hasSmtpConfig()) {
      return NextResponse.json(
        {
          success: false,
          error: "Email notifications not configured (missing SMTP_* env vars).",
        },
        { status: 503 },
      )
    }

    const safeType = typeof type === "string" && type.trim() ? type.trim() : "notification"
    const safeSubject =
      typeof subject === "string" && subject.trim() && subject.length <= 200
        ? subject.trim()
        : `Techmart ${safeType}`
    const safeMessage = typeof message === "string" ? message : JSON.stringify(message ?? {})

    const result = await sendEmail({ to: String(to).trim(), subject: safeSubject, text: safeMessage })

    return NextResponse.json({ success: true, data: { to, type: safeType, message: safeMessage, ...result } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}
