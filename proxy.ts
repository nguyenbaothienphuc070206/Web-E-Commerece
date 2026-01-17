import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Basic security headers (safe defaults).
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("x-frame-options", "DENY");
  response.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    // HSTS: only enable in production behind HTTPS.
    response.headers.set("strict-transport-security", "max-age=15552000; includeSubDomains");
  }

  const requestId = request.headers.get("x-request-id") || randomUUID();
  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
