import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv, hasSupabasePublicEnv, hasSupabaseServiceEnv } from "@/lib/server/env";

function getSupabaseUrl() {
  const env = getServerEnv();
  return env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getSupabaseAnonKey() {
  const env = getServerEnv();
  return env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

function getSupabaseServiceRoleKey() {
  const env = getServerEnv();
  return env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export const hasSupabasePublicConfig = hasSupabasePublicEnv();
export const hasSupabaseServiceConfig = hasSupabaseServiceEnv();

export function getSupabasePublicClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export function getSupabaseAdminClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
