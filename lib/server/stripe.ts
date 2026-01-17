import Stripe from "stripe";
import { getServerEnv } from "@/lib/server/env";

let cached: Stripe | null = null;

export function hasStripeConfig() {
  const env = getServerEnv();
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}

export function getStripeClient(): Stripe {
  if (cached) return cached;

  const env = getServerEnv();
  const key = env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");

  cached = new Stripe(key);

  return cached;
}

export function getStripeWebhookSecret(): string {
  const env = getServerEnv();
  if (!env.STRIPE_WEBHOOK_SECRET) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  return env.STRIPE_WEBHOOK_SECRET;
}
