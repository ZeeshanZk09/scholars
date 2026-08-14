import type { z } from "zod";

import { ValidationError } from "@/lib/errors";

/**
 * Parses a JSON request body against a Zod schema.
 * Throws ValidationError (422) with field details on failure.
 */
export async function parseJsonBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T,
  emptyMessage = "Request body is required"
): Promise<z.infer<T>> {
  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    throw new ValidationError(emptyMessage);
  }

  const result = schema.safeParse(raw);

  if (!result.success) {
    throw new ValidationError("Validation failed", result.error.issues);
  }

  return result.data;
}
