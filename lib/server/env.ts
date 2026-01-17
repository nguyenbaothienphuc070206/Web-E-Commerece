import { z } from "zod";

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).optional(),

    AUTH_SECRET: z.string().min(16).optional(),

    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(10).optional(),

    GEMINI_API_KEY: z.string().min(10).optional(),
    OPENAI_API_KEY: z.string().min(10).optional(),

    SMTP_HOST: z.string().min(1).optional(),
    SMTP_PORT: z.coerce.number().int().positive().optional(),
    SMTP_USER: z.string().min(1).optional(),
    SMTP_PASS: z.string().min(1).optional(),
    SMTP_FROM: z.string().min(1).optional(),
    SMTP_SECURE: z
      .union([z.literal("true"), z.literal("false")])
      .optional()
      .transform((v) => (v === undefined ? undefined : v === "true")),

    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  })
  .passthrough();

export type ServerEnv = z.infer<typeof EnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${message}`);
  }

  cached = parsed.data;
  return cached;
}

export function hasSupabasePublicEnv() {
  const env = getServerEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function hasSupabaseServiceEnv() {
  const env = getServerEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasSmtpEnv() {
  const env = getServerEnv();
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS);
}

export function hasStripeEnv() {
  const env = getServerEnv();
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}

export function requireAuthSecret(): string {
  const env = getServerEnv();
  const secret = env.AUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET.");
  return secret;
}
