import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, type, message } = body

    // This is a mock. Integrate with real email/SMS providers in production.
    console.log("[notifications] send", { to, type, message })

    return NextResponse.json({ success: true, data: { to, type, message } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}
