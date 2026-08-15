import { randomUUID } from "node:crypto";

import { jsonError } from "@/lib/response/api-response";
import { toSafeError, BadRequestError } from "@/lib/errors";
import { logger } from "@/lib/logger/logger";
import type { HttpStatus } from "@/lib/constants/http-status.constants";
import { idParamsSchema, slugParamsSchema } from "@/schemas/common/params.schema";

export type ApiContext = { requestId: string };

export type RouteParams = Record<string, string>;

export interface ApiRouteContext {
  params: Promise<RouteParams>;
}

export type ApiRouteHandler = (
  ctx: ApiContext,
  request: Request,
  routeContext?: ApiRouteContext,
) => Promise<Response>;

/**
 * Wraps a route handler so every known application error is mapped into the
 * standard API error contract, and unexpected errors become a safe generic
 * 500 that never leaks internals. Adds a request id for traceability that is
 * both logged and returned as the `X-Request-Id` response header.
 */
export function withApiHandler(handler: ApiRouteHandler) {
  return async function wrapped(
    request: Request,
    routeContext?: ApiRouteContext,
  ): Promise<Response> {
    const requestId = randomUUID();
    const startedAt = performance.now();

    try {
      const response = await handler({ requestId }, request, routeContext);

      response.headers.set("X-Request-Id", requestId);

      logRequest(request, requestId, response.status, startedAt);

      return response;
    } catch (error) {
      const safe = toSafeError(error, requestId);

      const response = jsonError(
        { code: safe.code, message: safe.message, details: safe.details ?? null },
        safe.message,
        safe.statusCode as HttpStatus,
        { requestId },
      );

      response.headers.set("X-Request-Id", requestId);

      logRequest(request, requestId, response.status, startedAt);

      return response;
    }
  };
}

function logRequest(
  request: Request,
  requestId: string,
  status: number,
  startedAt: number,
): void {
  const durationMs = Math.round(performance.now() - startedAt);
  const url = new URL(request.url);

  logger.info("API request completed", {
    requestId,
    method: request.method,
    path: url.pathname,
    status,
    durationMs,
  });
}

/**
 * Resolves a validated dynamic route parameter (e.g. `[id]` or `[slug]`).
 * Throws 400 when the segment is missing or empty.
 */
export async function getRouteParam(
  routeContext: ApiRouteContext | undefined,
  name: string,
): Promise<string> {
  const params = await routeContext?.params;
  const value = params?.[name];

  if (!value) {
    throw new BadRequestError(`Missing route parameter '${name}'.`);
  }

  const schema = name === "slug" ? slugParamsSchema : idParamsSchema;
  const result = schema.safeParse({ [name]: value });

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? `Invalid route parameter '${name}'.`;
    throw new BadRequestError(message);
  }

  return (result.data as Record<string, string>)[name] ?? value;
}