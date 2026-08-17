import { describe, it, expect } from "vitest";

import { formatDate, formatDateShort } from "@/lib/format";
import { slugify } from "@/lib/utils/slug";

describe("slugify (Phase 16/18 utilities)", () => {
  it("strips punctuation and collapses whitespace", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("removes underscores and collapses repeated separators", () => {
    expect(slugify("Foo   Bar__Baz")).toBe("foo-barbaz");
    expect(slugify("Foo Bar Baz")).toBe("foo-bar-baz");
  });

  it("trims leading/trailing separators", () => {
    expect(slugify("--Hello World--")).toBe("hello-world");
  });
});

describe("formatDate (shared utilities)", () => {
  // Use a midday UTC date so the calendar day does not shift across timezones.
  it("formatDateShort formats a known date", () => {
    expect(formatDateShort(new Date("2026-08-14T12:00:00.000Z"))).toBe(
      "14 Aug 2026",
    );
  });

  it("returns null for invalid dates", () => {
    expect(formatDate(new Date("not a date"))).toBeNull();
    expect(formatDate(null)).toBeNull();
  });
});
