import { describe, it, expect } from "vitest";

import {
  AppError,
  ValidationError,
  NotFoundError,
  isAppError,
} from "@/lib/errors/app-error";
import { ERROR_CODES } from "@/lib/errors/error-codes";

describe("AppError and subclasses", () => {
  it("should create a base AppError with correct properties", () => {
    const error = new AppError(
      ERROR_CODES.INTERNAL_ERROR,
      "Something went wrong",
      {
        statusCode: 500,
        requestId: "123",
      },
    );

    expect(error.message).toBe("Something went wrong");
    expect(error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
    expect(error.statusCode).toBe(500);
    expect(error.requestId).toBe("123");
    expect(isAppError(error)).toBe(true);
  });

  it("should create a ValidationError properly", () => {
    const error = new ValidationError("Invalid input", { field: "email" });

    expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(error.statusCode).toBe(422);
    expect(error.details).toEqual({ field: "email" });
    expect(isAppError(error)).toBe(true);
  });

  it("should create a NotFoundError properly", () => {
    const error = new NotFoundError("User not found");

    expect(error.code).toBe(ERROR_CODES.NOT_FOUND);
    expect(error.statusCode).toBe(404);
  });

  it("should identify non-AppErrors correctly", () => {
    const regularError = new Error("Regular error");
    expect(isAppError(regularError)).toBe(false);
  });
});
