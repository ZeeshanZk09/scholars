import { describe, it, expect } from "vitest";

import { createContactMessageSchema } from "@/schemas/contact/contact.schema";
import { createUserSchema, updateUserSchema } from "@/schemas/user/user.schema";

describe("User schema password policy (Phase 23)", () => {
  const base = { name: "Test User", email: "test@example.com" };

  it("rejects passwords shorter than 8 characters", () => {
    expect(() =>
      createUserSchema.parse({ ...base, password: "abc1" }),
    ).toThrow();
  });

  it("requires at least one letter and one number", () => {
    expect(() =>
      createUserSchema.parse({ ...base, password: "allletters" }),
    ).toThrow();
    expect(() =>
      createUserSchema.parse({ ...base, password: "12345678" }),
    ).toThrow();
    expect(() =>
      createUserSchema.parse({ ...base, password: "GoodPass123" }),
    ).not.toThrow();
  });

  it("lower-cases and trims email on update", () => {
    const parsed = updateUserSchema.parse({ email: "User@Example.COM" });

    expect(parsed.email).toBe("user@example.com");
  });
});

describe("Contact message schema (Phase 20 hardening)", () => {
  const valid = { name: "Ali", email: "ali@example.com", message: "Hello" };

  it("accepts a valid submission and strips control characters", () => {
    const parsed = createContactMessageSchema.parse({
      ...valid,
      message: "Hello\u0000",
    });

    expect(parsed.message).toBe("Hello");
  });

  it("rejects honeypot field fills", () => {
    expect(() =>
      createContactMessageSchema.parse({ ...valid, website: "http://spam" }),
    ).toThrow();
  });

  it("lower-cases the email", () => {
    const parsed = createContactMessageSchema.parse({
      ...valid,
      email: "Ali@Example.COM",
    });

    expect(parsed.email).toBe("ali@example.com");
  });
});
