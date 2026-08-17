import { describe, it, expect, vi } from "vitest";

import { RateLimitError } from "@/lib/errors";
import { rateLimit, getClientIp, recordLoginFailure, clearLoginAttempts } from "@/lib/security/rate-limit";
import { assertSameOrigin } from "@/lib/security/same-origin";
import { sanitizeRichHtml } from "@/lib/security/sanitize-html";

vi.mock("@/server/db", () => {
  const store = new Map<string, { count: number; resetAt: number }>();

  return {
    prisma: {
      rateLimitBucket: {
        async findUnique({ where }: { where: { key: string } }) {
          const bucket = store.get(where.key);

          return bucket
            ? { key: where.key, count: bucket.count, resetAt: new Date(bucket.resetAt) }
            : null;
        },
        async upsert({
          where,
          create,
          update,
        }: {
          where: { key: string };
          create: { count: number; resetAt: Date };
          update: { count: number; resetAt: Date };
        }) {
          const existing = store.get(where.key);
          const next =
            !existing || existing.resetAt <= Date.now()
              ? { count: create.count, resetAt: create.resetAt.getTime() }
              : { count: update.count, resetAt: update.resetAt.getTime() };

          store.set(where.key, next);

          return { key: where.key, count: next.count, resetAt: new Date(next.resetAt) };
        },
        async update({
          where,
          data,
        }: {
          where: { key: string };
          data: { count: { increment: number } };
        }) {
          const bucket = store.get(where.key);

          if (bucket) {
            bucket.count += data.count.increment;
          }

          return {
            key: where.key,
            count: bucket?.count ?? 0,
            resetAt: new Date(bucket?.resetAt ?? 0),
          };
        },
        async deleteMany({ where }: { where: { key: string } }) {
          store.delete(where.key);

          return { count: 1 };
        },
      },
    },
  };
});


describe("sanitizeRichHtml (Phase 23 XSS defense)", () => {
  it("strips script tags and event handlers", () => {
    const result = sanitizeRichHtml(
      '<p onclick="alert(1)">hello<script>alert(2)</script></p>',
    );

    expect(result).toContain("<p>hello</p>");
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("<script");
  });

  it("strips javascript: URI scheme", () => {
    const result = sanitizeRichHtml('<a href="javascript:alert(1)">x</a>');

    expect(result).not.toContain("javascript:");
    expect(result).toContain("<a");
  });

  it("strips onerror handlers from images", () => {
    const result = sanitizeRichHtml("<img src=x onerror=alert(1)>");

    expect(result).not.toContain("onerror");
    expect(result).toContain("<img");
  });

  it("allows safe img elements and relative/placehold.co URLs", () => {
    const result = sanitizeRichHtml(
      '<img src="https://placehold.co/800x450/png" alt="pic">',
    );

    expect(result).toContain('src="https://placehold.co/800x450/png"');
    expect(result).toContain('alt="pic"');
  });
});

describe("rateLimit (Phase 23 abuse defense)", () => {
  it("throws a RateLimitError after the limit is exceeded", async () => {
    await expect(
      rateLimit({ key: "rl-test-1", limit: 2, windowMs: 60_000 }),
    ).resolves.toBeUndefined();
    await expect(
      rateLimit({ key: "rl-test-1", limit: 2, windowMs: 60_000 }),
    ).resolves.toBeUndefined();
    await expect(
      rateLimit({ key: "rl-test-1", limit: 2, windowMs: 60_000 }),
    ).rejects.toThrow(RateLimitError);
  });

  it("tracks keys independently", async () => {
    const a = () => rateLimit({ key: "rl-test-2a", limit: 1, windowMs: 60_000 });
    const b = () => rateLimit({ key: "rl-test-2b", limit: 1, windowMs: 60_000 });

    await expect(a()).resolves.toBeUndefined();
    await expect(b()).resolves.toBeUndefined();
    await expect(a()).rejects.toThrow(RateLimitError);
  });
});

describe("recordLoginFailure / clearLoginAttempts (login brute-force defense)", () => {
  it("locks after the maximum failed attempts and resets on clear", async () => {
    const key = "login-fail:test@example.com";

    for (let i = 0; i < 5; i++) {
      expect(await recordLoginFailure(key)).toBe(false);
    }

    expect(await recordLoginFailure(key)).toBe(true);

    await clearLoginAttempts(key);

    expect(await recordLoginFailure(key)).toBe(false);
  });
});

describe("getClientIp (Phase 23 abuse defense)", () => {
  it("reads X-Forwarded-For first", () => {
    const ip = getClientIp(
      new Request("http://localhost/", {
        headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18" },
      }),
    );

    expect(ip).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip then x-forwarded-for", () => {
    const ip = getClientIp(
      new Request("http://localhost/", {
        headers: { "x-real-ip": "10.0.0.5" },
      }),
    );

    expect(ip).toBe("10.0.0.5");
  });
});

describe("assertSameOrigin (Phase 23 CSRF defense)", () => {
  it("rejects cross-origin requests", () => {
    const request = new Request("http://localhost/", {
      method: "POST",
      headers: { origin: "https://evil.example.com" },
    });

    expect(() => assertSameOrigin(request)).toThrow();
  });

  it("allows same-origin requests", () => {
    const request = new Request("http://localhost:3000/", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    });

    expect(() => assertSameOrigin(request)).not.toThrow();
  });

  it("allows requests with no Origin header", () => {
    const request = new Request("http://localhost/", { method: "POST" });

    expect(() => assertSameOrigin(request)).not.toThrow();
  });
});
