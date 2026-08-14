import { AppError, isAppError, DatabaseError } from "./app-error";
import { ERROR_CODES } from "./error-codes";
import { logger } from "@/lib/logger/logger";

const GENERIC_ERROR_MESSAGE =
  "We couldn't complete your request right now. Please try again later.";

export interface SafeError {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Maps any thrown value into a safe, client-safe error representation.
 * Never exposes stack traces, database internals, or secrets.
 */
export function toSafeError(error: unknown, requestId?: string): SafeError {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (isPrismaError(error)) {
    logger.error("Database error occurred", { error, requestId });
    return {
      code: ERROR_CODES.DATABASE_ERROR,
      message: GENERIC_ERROR_MESSAGE,
      statusCode: 500,
    };
  }

  logger.error("Unexpected error occurred", { error, requestId });

  return {
    code: ERROR_CODES.INTERNAL_ERROR,
    message: GENERIC_ERROR_MESSAGE,
    statusCode: 500,
  };
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }
  return new DatabaseError();
}

function isPrismaError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  const candidate = error as { name?: unknown };
  return typeof candidate.name === "string" && candidate.name.startsWith("PrismaClient");
}
