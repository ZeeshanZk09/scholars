import { RateLimitError } from "@/lib/errors";
import { prisma } from "@/server/db";

/**
 * Fixed-window rate limiter backed by PostgreSQL.
 *
 * Replaces the previous in-memory implementation, which was per-process and
 * ineffective on serverless/multi-instance deployments (every instance kept
 * its own counters, so an attacker could bypass the limit by spreading
 * requests across instances). The bucket is persisted in the shared database
 * so limits are enforced uniformly across all instances.
 *
 * Fails open: if the store is unreachable the request is allowed rather than
 * breaking the endpoint.
 */
export async function rateLimit(options: {
  key: string;
  limit?: number;
  windowMs?: number;
}): Promise<void> {
  const { key, limit = 10, windowMs = 60_000 } = options;
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  try {
    const existing = await prisma.rateLimitBucket.findUnique({ where: { key } });

    if (!existing || existing.resetAt <= now) {
      await prisma.rateLimitBucket.upsert({
        where: { key },
        create: { key, count: 1, resetAt },
        update: { count: 1, resetAt },
      });

      return;
    }

    if (existing.count >= limit) {
      const retryAfter = Math.max(
        0,
        Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000),
      );

      throw new RateLimitError(retryAfter);
    }

    await prisma.rateLimitBucket.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }

    // Fail open on store errors so legitimate traffic is never blocked.
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

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;

/**
 * Records a failed login attempt for `identifier` (DB-backed, serverless-safe).
 * Only failures are counted — a successful login calls `clearLoginAttempts` —
 * so legitimate users are never throttled by their own successful logins.
 *
 * Returns whether the account is now locked. On database errors it fails open
 * (nothing is recorded) so an outage never blocks authentication.
 */
export async function recordLoginFailure(identifier: string): Promise<boolean> {
  try {
    await rateLimit({
      key: `login-fail:${identifier}`,
      limit: LOGIN_MAX_ATTEMPTS,
      windowMs: LOGIN_LOCK_WINDOW_MS,
    });

    return false;
  } catch (error) {
    if (error instanceof RateLimitError) {
      return true;
    }

    return false;
  }
}

/** Clears recorded failed-login attempts for `identifier` after a success. */
export async function clearLoginAttempts(identifier: string): Promise<void> {
  try {
    await prisma.rateLimitBucket.deleteMany({
      where: { key: `login-fail:${identifier}` },
    });
  } catch {
    // Fail open; throttling state is best-effort.
  }
}
