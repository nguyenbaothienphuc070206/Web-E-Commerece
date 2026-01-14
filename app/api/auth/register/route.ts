import { NextResponse } from "next/server"
import { users, type User } from "../_store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body || {}
    if (!email || !password) return NextResponse.json({ success: false, error: "Missing" }, { status: 400 })
    if (users.find((u) => u.email === email)) return NextResponse.json({ success: false, error: "Exists" }, { status: 409 })
    const user: User = { id: users.length + 1, email, password, name, role: "user" }
    users.push(user)
    const { password: _, ...sanitized } = user
    return NextResponse.json({ success: true, data: sanitized })
  } catch {
    return NextResponse.json({ success: false, error: "Error" }, { status: 500 })
  }
}

export function GET() {
  const list = users.map(({ password, ...u }) => u)
  return NextResponse.json({ success: true, data: list })
}
