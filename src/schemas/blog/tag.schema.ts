import { z } from "zod";

export const createBlogTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
});

export const updateBlogTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
});

export type CreateBlogTagInput = z.infer<typeof createBlogTagSchema>;
export type UpdateBlogTagInput = z.infer<typeof updateBlogTagSchema>;
