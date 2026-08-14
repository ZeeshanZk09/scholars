import { HTTP_STATUS, type HttpStatus } from "@/lib/constants/http-status.constants";
import type {
  ApiErrorBody,
  ApiErrorResponse,
  ApiMeta,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationMeta,
} from "@/types/api/api-response.types";

export function successResponse<T>(
  data: T,
  message = "Request completed successfully",
  meta?: ApiMeta
): ApiSuccessResponse<T> {
  return { success: true, data, message, meta: meta ?? null };
}

export function errorResponse(
  error: ApiErrorBody,
  message = "Request failed",
  meta?: ApiMeta
): ApiErrorResponse {
  return {
    success: false,
    data: null,
    message,
    error,
    meta: meta ?? null,
  };
}

export function paginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return { page, limit, total, totalPages };
}

export function jsonSuccess<T>(
  data: T,
  message = "Request completed successfully",
  status: HttpStatus = HTTP_STATUS.OK,
  meta?: ApiMeta
): Response {
  return Response.json(successResponse(data, message, meta), { status });
}

export function jsonCreated<T>(
  data: T,
  message = "Resource created successfully",
  meta?: ApiMeta
): Response {
  return jsonSuccess(data, message, HTTP_STATUS.CREATED, meta);
}

export function jsonSuccessPaged<T>(
  data: T[],
  pagination: PaginationMeta,
  message = "Resources retrieved successfully",
  meta?: ApiMeta
): Response {
  const body = {
    success: true,
    data,
    message,
    meta: meta ?? null,
    pagination,
  } satisfies PaginatedResponse<T>;

  return Response.json(body, { status: HTTP_STATUS.OK });
}

export function jsonNoContent(): Response {
  return new Response(null, { status: HTTP_STATUS.NO_CONTENT });
}

export function jsonError(
  error: ApiErrorBody,
  message: string,
  status: HttpStatus,
  meta?: ApiMeta
): Response {
  return Response.json(errorResponse(error, message, meta), { status });
}
