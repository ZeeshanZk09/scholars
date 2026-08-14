import { z } from "zod";

/** Validates the `id` from a dynamic route segment, e.g. `/admin/users/[id]`. */
export const idParamsSchema = z.object({
  id: z.string().trim().min(1, "Resource id is required"),
});

/** Validates the `slug` from a public detail route, e.g. `/api/v1/blogs/[slug]`. */
export const slugParamsSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
});

export type IdParams = z.infer<typeof idParamsSchema>;
export type SlugParams = z.infer<typeof slugParamsSchema>;
