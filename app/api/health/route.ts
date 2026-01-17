import { NextResponse } from "next/server";
import { hasSupabasePublicEnv, hasSupabaseServiceEnv, hasSmtpEnv, hasStripeEnv } from "@/lib/server/env";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      supabase: {
        public: hasSupabasePublicEnv(),
        service: hasSupabaseServiceEnv(),
      },
      smtp: hasSmtpEnv(),
      stripe: hasStripeEnv(),
    },
  });
}
