import { describe, it, expect } from "vitest";

import { RateLimitError } from "@/lib/errors";
import { rateLimit, getClientIp } from "@/lib/security/rate-limit";
import { assertSameOrigin } from "@/lib/security/same-origin";
import { sanitizeRichHtml } from "@/lib/security/sanitize-html";

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
  it("throws a RateLimitError after the limit is exceeded", () => {
    expect(() =>
      rateLimit({ key: "rl-test-1", limit: 2, windowMs: 60_000 }),
    ).not.toThrow();
    expect(() =>
      rateLimit({ key: "rl-test-1", limit: 2, windowMs: 60_000 }),
    ).not.toThrow();
    expect(() =>
      rateLimit({ key: "rl-test-1", limit: 2, windowMs: 60_000 }),
    ).toThrow(RateLimitError);
  });

  it("tracks keys independently", () => {
    const a = () =>
      rateLimit({ key: "rl-test-2a", limit: 1, windowMs: 60_000 });
    const b = () =>
      rateLimit({ key: "rl-test-2b", limit: 1, windowMs: 60_000 });

    expect(a).not.toThrow();
    expect(b).not.toThrow();
    expect(a).toThrow(RateLimitError);
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
