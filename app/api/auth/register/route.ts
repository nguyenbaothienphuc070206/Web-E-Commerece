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

    console.log("Frontend Body Response:", body);

    const { email, password, name } = body || {}
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Missing email or password" }, { status: 400 })
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (normalizedEmail.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 })
    }

    const pass = String(password);
    if (pass.length < 8 || pass.length > 72) {
      return NextResponse.json({ success: false, error: "Password must be 8-72 characters" }, { status: 400 })
    }

    const displayName = typeof name === "string" ? name.trim() : "";
    if (displayName && displayName.length > 80) {
      return NextResponse.json({ success: false, error: "Name too long" }, { status: 400 })
    }

    const normalizedEmailKey = normalizedEmail;
    const rlEmail = await rateLimit({ key: `auth:register:email:${normalizedEmailKey}`, limit: 6, windowMs: 60_000 });
    if (!rlEmail.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again shortly." },
        { status: 429, headers: { "x-ratelimit-reset": String(rlEmail.resetAt) } }
      );
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(pass, 12);
    
    let user;
    try {
      user = await createUser({ 
        email: normalizedEmail, 
        passwordHash, 
        name: displayName || undefined, 
        role: "user" 
      });
    } catch (createError) {
      console.error('createUser error:', createError);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to create user",
        details: createError instanceof Error ? createError.message : String(createError)
      }, { status: 500 });
    }

    const token = createSessionToken(
      { id: user.id, email: user.email, name: user.name, role: user.role }, 
      60 * 60 * 24 * 7
    );
    
    const res = NextResponse.json({ success: true, data: toPublicUser(user) });
    res.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    
    return res;
  } catch (error) {
    console.error('Register route error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}