import { ERROR_CODES, type ErrorCode } from "./error-codes";
import { HTTP_STATUS, type HttpStatus } from "@/lib/constants/http-status.constants";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: HttpStatus;
  public readonly details?: unknown;
  public readonly requestId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    options: {
      statusCode?: HttpStatus;
      details?: unknown;
      cause?: unknown;
      requestId?: string;
    } = {}
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = options.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    this.details = options.details;
    this.requestId = options.requestId;
    this.cause = options.cause;
  }

  toApiBody() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(ERROR_CODES.VALIDATION_ERROR, message, {
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details,
    });
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(ERROR_CODES.AUTHENTICATION_ERROR, message, {
      statusCode: HTTP_STATUS.UNAUTHORIZED,
    });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(ERROR_CODES.AUTHORIZATION_ERROR, message, {
      statusCode: HTTP_STATUS.FORBIDDEN,
    });
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found") {
    super(ERROR_CODES.NOT_FOUND, message, {
      statusCode: HTTP_STATUS.NOT_FOUND,
    });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(ERROR_CODES.CONFLICT, message, {
      statusCode: HTTP_STATUS.CONFLICT,
      details,
    });
    this.name = "ConflictError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "The request is invalid") {
    super(ERROR_CODES.BAD_REQUEST, message, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
    });
    this.name = "BadRequestError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests, please try again later") {
    super(ERROR_CODES.RATE_LIMITED, message, {
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    });
    this.name = "RateLimitError";
  }
}

export class DatabaseError extends AppError {
  constructor(message = "A database operation failed", details?: unknown) {
    super(ERROR_CODES.DATABASE_ERROR, message, {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      details,
    });
    this.name = "DatabaseError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
