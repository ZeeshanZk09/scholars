import { z } from "zod";

/**
 * Shared validation for `?page=` / `?limit=` pagination query parameters.
 * Values must be positive integers; defaults apply when absent.
 * The limit is clamped to the API maximum by the consumer.
 */
export const paginationQuerySchema = z.object({
  page: z.coerce
    .number({ error: "'page' must be a positive integer." })
    .int("'page' must be a positive integer.")
    .min(1, "'page' must be a positive integer.")
    .default(1),
  limit: z.coerce
    .number({ error: "'limit' must be a positive integer." })
    .int("'limit' must be a positive integer.")
    .min(1, "'limit' must be a positive integer.")
    .default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
