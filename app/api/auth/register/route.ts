import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieName } from "@/lib/server/auth";
import { ensureSeedAdmin, toPublicUser, users, type User } from "../_store";

export async function POST(request: Request) {
  try {
    await ensureSeedAdmin();
    const body = await request.json()
    const { email, password, name } = body || {}
    if (!email || !password) return NextResponse.json({ success: false, error: "Missing" }, { status: 400 })
    const normalizedEmail = String(email).toLowerCase();
    if (users.find((u) => u.email.toLowerCase() === normalizedEmail))
      return NextResponse.json({ success: false, error: "Exists" }, { status: 409 })

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user: User = { id: users.length + 1, email: normalizedEmail, passwordHash, name, role: "user" }
    users.push(user)

    const token = createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role }, 60 * 60 * 24 * 7);
    const res = NextResponse.json({ success: true, data: toPublicUser(user) });
    res.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ success: false, error: "Error" }, { status: 500 })
  }
}
