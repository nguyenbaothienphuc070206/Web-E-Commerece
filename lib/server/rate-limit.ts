type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number }

function memoryRateLimit(opts: { key: string; limit: number; windowMs: number }): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(opts.key)

  if (!existing || now > existing.resetAt) {
    const bucket = { count: 1, resetAt: now + opts.windowMs }
    buckets.set(opts.key, bucket)
    return { allowed: true, remaining: opts.limit - 1, resetAt: bucket.resetAt }
  }

  if (existing.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return { allowed: true, remaining: Math.max(0, opts.limit - existing.count), resetAt: existing.resetAt }
}

function hasUpstashEnv() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

let upstashCache:
  | {
      getLimiter: (limit: number, windowMs: number) => Promise<any>
    }
  | null = null

async function getUpstashLimiter(limit: number, windowMs: number) {
  if (!hasUpstashEnv()) return null

  if (!upstashCache) {
    const [{ Ratelimit }, { Redis }] = await Promise.all([
      import("@upstash/ratelimit"),
      import("@upstash/redis"),
    ])

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })

    const limiterByConfig = new Map<string, any>()

    upstashCache = {
      getLimiter: async (lim: number, winMs: number) => {
        const winSeconds = Math.max(1, Math.ceil(winMs / 1000))
        const key = `${lim}:${winSeconds}s`
        const existing = limiterByConfig.get(key)
        if (existing) return existing

        const rl = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(lim, `${winSeconds} s`),
          analytics: false,
        })
        limiterByConfig.set(key, rl)
        return rl
      },
    }
  }

  return upstashCache.getLimiter(limit, windowMs)
}

// Prefer Upstash on Vercel (distributed), fallback to in-memory locally.
export async function rateLimit(opts: { key: string; limit: number; windowMs: number }): Promise<RateLimitResult> {
  try {
    const limiter = await getUpstashLimiter(opts.limit, opts.windowMs)
    if (!limiter) return memoryRateLimit(opts)

    const res = await limiter.limit(opts.key)
    const resetAt = res?.reset ? new Date(res.reset).getTime() : Date.now() + opts.windowMs

    return {
      allowed: !!res?.success,
      remaining: typeof res?.remaining === "number" ? res.remaining : 0,
      resetAt,
    }
  } catch {
    // If Upstash is misconfigured/unavailable, never block the app.
    return memoryRateLimit(opts)
  }
}

export function getRequestIp(req: Request): string {
  // Vercel/Proxy common headers
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'unknown'
}
