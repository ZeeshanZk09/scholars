import { describe, it, expect } from "vitest";

import {
  toSafeError,
  isAppError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { ERROR_CODES } from "@/lib/errors/error-codes";

describe("toSafeError (Phase 24 structured errors)", () => {
  it("passes through AppError fields verbatim", () => {
    const error = new NotFoundError("No such post");

    const safe = toSafeError(error, "req-1");

    expect(safe.code).toBe(ERROR_CODES.NOT_FOUND);
    expect(safe.message).toBe("No such post");
    expect(safe.statusCode).toBe(404);
    expect(safe.details).toBeUndefined();
  });

  it("returns a generic 500 for unknown errors without leaking internals", () => {
    const safe = toSafeError(
      new Error("some internal stack trace with secrets"),
      "req-2",
    );

    expect(safe.statusCode).toBe(500);
    expect(safe.code).toBe(ERROR_CODES.INTERNAL_ERROR);
    expect(safe.message).not.toContain("stack trace");
    expect(safe.message.toLowerCase()).not.toContain("secret");
  });

  it("maps Prisma errors to a generic database message", () => {
    const prismaError = Object.assign(new Error("Connection refused"), {
      name: "PrismaClientKnownRequestError",
    });

    const safe = toSafeError(prismaError, "req-3");

    expect(safe.code).toBe(ERROR_CODES.DATABASE_ERROR);
    expect(safe.message).not.toContain("Connection refused");
  });

  it("treats a thrown AppError as an app error", () => {
    const safe = toSafeError(new AuthenticationError("Nope"), "req-4");

    expect(safe.code).toBe(ERROR_CODES.AUTHENTICATION_ERROR);
    expect(safe.statusCode).toBe(401);
    expect(isAppError(new ValidationError("bad", { field: "x" }))).toBe(true);
  });
});
