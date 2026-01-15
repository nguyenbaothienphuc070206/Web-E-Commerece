import crypto from "crypto";
import { cookies } from "next/headers";

export type SessionUser = {
  id: number;
  email: string;
  name?: string;
  role: "user" | "admin";
};

const COOKIE_NAME = "wec_session";

function getAuthSecretOrNull() {
  return process.env.AUTH_SECRET || null;
}

function requireAuthSecret(): string {
  const secret = getAuthSecretOrNull();
  if (!secret) throw new Error("Missing AUTH_SECRET.");
  return secret;
}

function base64UrlEncode(input: Buffer | string) {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecodeToString(input: string) {
  const pad = input.length % 4 === 0 ? 0 : 4 - (input.length % 4);
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(normalized, "base64").toString("utf8");
}

function sign(data: string, secret: string) {
  return base64UrlEncode(crypto.createHmac("sha256", secret).update(data).digest());
}

type TokenPayload = {
  sub: number;
  email: string;
  name?: string;
  role: "user" | "admin";
  exp: number; // unix seconds
};

export function createSessionToken(user: SessionUser, ttlSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: now + ttlSeconds,
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(payloadJson);
  const sig = sign(payloadB64, requireAuthSecret());
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const secret = getAuthSecretOrNull();
    if (!secret) return null;

    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;

    const expected = sign(payloadB64, secret);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;

    const payload = JSON.parse(base64UrlDecodeToString(payloadB64)) as TokenPayload;
    if (!payload?.sub || !payload?.email || !payload?.role || !payload?.exp) return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return null;

    return { id: payload.sub, email: payload.email, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

export async function getSessionUserFromCookies(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}
