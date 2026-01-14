import { NextResponse } from "next/server"
import { users } from "../_store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}
    if (!email || !password) return NextResponse.json({ success: false, error: "Missing" }, { status: 400 })
  const user = users.find((u) => u.email === email && u.password === password)
    if (!user) return NextResponse.json({ success: false, error: "Invalid" }, { status: 401 })
    const { password: _, ...sanitized } = user
    return NextResponse.json({ success: true, data: sanitized })
  } catch {
    return NextResponse.json({ success: false, error: "Error" }, { status: 500 })
  }
}
