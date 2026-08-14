import { RateLimitError } from "@/lib/errors";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const CLEANUP_EVERY = 500;
const MAX_BUCKETS = 10_000;
let checksSinceCleanup = 0;

/**
 * Fixed-window in-memory rate limiter.
 * Throws RateLimitError (429) when `limit` requests are exceeded within `windowMs`.
 * NOTE: single-instance only; replace with a shared store (Redis etc.) when scaling.
 */
export function rateLimit(options: {
  key: string;
  limit?: number;
  windowMs?: number;
}): void {
  const { key, limit = 10, windowMs = 60_000 } = options;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
  } else {
    bucket.count += 1;

    if (bucket.count > limit) {
      throw new RateLimitError();
    }
  }

  checksSinceCleanup += 1;

  if (checksSinceCleanup >= CLEANUP_EVERY || buckets.size > MAX_BUCKETS) {
    checksSinceCleanup = 0;

    for (const [staleKey, staleBucket] of buckets) {
      if (staleBucket.resetAt <= now) {
        buckets.delete(staleKey);
      }
    }
  }
}

/** Best-effort client IP extraction, honouring proxies. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}
