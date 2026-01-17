import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieName } from "@/lib/server/auth";
import { getRequestIp, rateLimit } from "@/lib/server/rate-limit";
import { ensureSeedAdmin, toPublicUser, createUser, findUserByEmail } from "../_store";

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rlIp = await rateLimit({ key: `auth:register:ip:${ip}`, limit: 6, windowMs: 60_000 });
    if (!rlIp.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again shortly." },
        { status: 429, headers: { "x-ratelimit-reset": String(rlIp.resetAt) } }
      );
    }

    await ensureSeedAdmin();
    const body = await request.json()
    const { email, password, name } = body || {}
    if (!email || !password) return NextResponse.json({ success: false, error: "Missing" }, { status: 400 })

    const normalizedEmailKey = String(email).toLowerCase().trim();
    const rlEmail = await rateLimit({ key: `auth:register:email:${normalizedEmailKey}`, limit: 6, windowMs: 60_000 });
    if (!rlEmail.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again shortly." },
        { status: 429, headers: { "x-ratelimit-reset": String(rlEmail.resetAt) } }
      );
    }

    const normalizedEmail = String(email).toLowerCase();
    if (await findUserByEmail(normalizedEmail))
      return NextResponse.json({ success: false, error: "Exists" }, { status: 409 })

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await createUser({ email: normalizedEmail, passwordHash, name, role: "user" })

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
