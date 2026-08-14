import { z } from "zod";

import { contentStatusSchema, urlField } from "@/schemas/common/content.schema";

export const pageSeoSchema = z.object({
  seoTitle: z.string().trim().max(200, "SEO title is too long").optional(),
  metaDescription: z.string().trim().max(500, "Meta description is too long").optional(),
  canonicalUrl: z.string().trim().max(2048, "Canonical URL is too long").optional().or(z.literal("")),
  ogTitle: z.string().trim().max(200, "Open Graph title is too long").optional(),
  ogDescription: z.string().trim().max(500, "Open Graph description is too long").optional(),
  ogImage: z.string().trim().max(2048, "Open Graph image URL is too long").optional().or(z.literal("")),
  robots: z.string().trim().max(200, "Robots is too long").optional(),
});

const coreSchema = {
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200, "Slug must be at most 200 characters")
    .optional(),
  content: z.string().trim().max(50000, "Content is too long").optional(),
  featuredImage: urlField,
  layout: z.string().trim().max(100, "Layout is too long").optional(),
  status: contentStatusSchema.default("DRAFT"),
  publishedAt: z.iso.datetime().optional(),
  seo: pageSeoSchema.optional(),
};

export const createPageSchema = z.object({ ...coreSchema });

export const updatePageSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200),
    content: z.string().trim().max(50000).optional(),
    featuredImage: urlField,
    layout: z.string().trim().max(100).optional(),
    status: contentStatusSchema,
    publishedAt: z.iso.datetime().optional(),
    seo: pageSeoSchema.nullable().optional(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type PageSeoInput = z.infer<typeof pageSeoSchema>;