import { describe, expect, it, vi } from "vitest";

function setOrDelete(key: string, value: string | undefined) {
  if (typeof value === "string") process.env[key] = value;
  else delete process.env[key];
}

describe("server env validation", () => {
  it("accepts valid optional env vars", async () => {
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const prevAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    try {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon_key_1234567890";

      vi.resetModules();
      const { getServerEnv } = await import("../lib/server/env");
      const env = getServerEnv();
      expect(env.NEXT_PUBLIC_SUPABASE_URL).toContain("https://");
    } finally {
      setOrDelete("NEXT_PUBLIC_SUPABASE_URL", prevUrl);
      setOrDelete("NEXT_PUBLIC_SUPABASE_ANON_KEY", prevAnon);
      vi.resetModules();
    }
  });

  it("throws on invalid SUPABASE URL", async () => {
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "not-a-url";

      vi.resetModules();
      const { getServerEnv } = await import("../lib/server/env");
      expect(() => getServerEnv()).toThrow(/Invalid environment configuration/i);
    } finally {
      setOrDelete("NEXT_PUBLIC_SUPABASE_URL", prevUrl);
      vi.resetModules();
    }
  });
});
