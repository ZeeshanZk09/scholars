import { BadRequestError } from "@/lib/errors";
import { paginationQuerySchema } from "@/schemas/common/query.schema";

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

const MAX_LIMIT = 100;

/**
 * Parses `?page=&limit=` query parameters into validated pagination options
 * ready for Prisma `skip`/`take`. Values are validated via the shared Zod
 * schema, defaulted, and clamped to the API maximum.
 */
export function parsePagination(url: URL): PaginationOptions {
  const raw: Record<string, unknown> = {};

  const pageRaw = url.searchParams.get("page");
  if (pageRaw !== null) {
    raw.page = pageRaw;
  }

  const limitRaw = url.searchParams.get("limit");
  if (limitRaw !== null) {
    raw.limit = limitRaw;
  }

  const result = paginationQuerySchema.safeParse(raw);

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? "Invalid pagination parameters.";
    throw new BadRequestError(message);
  }

  const { page, limit } = result.data;
  const clampedLimit = Math.min(limit, MAX_LIMIT);

  return {
    page,
    limit: clampedLimit,
    skip: (page - 1) * clampedLimit,
    take: clampedLimit,
  };
}

/**
 * Extracts an optional enum-typed query filter (e.g. `?status=PUBLISHED`).
 * Returns `undefined` when the parameter is absent.
 */
export function parseEnumFilter<T extends string>(
  url: URL,
  key: string,
  values: readonly T[],
): T | undefined {
  const raw = url.searchParams.get(key);
  if (raw === null) {
    return undefined;
  }
  if (!values.includes(raw as T)) {
    throw new BadRequestError(`'${key}' must be one of: ${values.join(", ")}.`);
  }
  return raw as T;
}