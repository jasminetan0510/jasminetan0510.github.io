/**
 * Basic in-memory rate limiter (sliding window per key, e.g. per IP).
 *
 * Good enough to stop a single bot hammering /api/contact. Limitation:
 * Vercel can run several serverless instances, each with its own memory,
 * so a determined attacker could get a few extra messages through. If
 * that ever matters, swap this for @upstash/ratelimit (free tier) with
 * the same call signature.
 */
const hits = new Map<string, number[]>()

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)

  if (recent.length >= max) {
    hits.set(key, recent)
    return { ok: false as const, retryAfterSec: Math.ceil((windowMs - (now - recent[0])) / 1000) }
  }

  recent.push(now)
  hits.set(key, recent)

  // Keep memory bounded on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (!times.some((t) => now - t < windowMs)) hits.delete(k)
    }
  }
  return { ok: true as const, retryAfterSec: 0 }
}

/** Best-effort client IP behind Vercel's proxy. */
export function clientIp(req: Request) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}