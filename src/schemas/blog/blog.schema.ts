import { z } from "zod";

export const blogStatusValues = ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"] as const;

export const blogSeoSchema = z.object({
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(500).optional().or(z.literal("")),
  keywords: z.string().trim().max(500).optional().or(z.literal("")),
  canonicalUrl: z.string().trim().max(2048).optional().or(z.literal("")),
  ogTitle: z.string().trim().max(200).optional().or(z.literal("")),
  ogDescription: z.string().trim().max(500).optional().or(z.literal("")),
  ogImage: z.string().trim().max(2048).optional().or(z.literal("")),
  robots: z.string().trim().max(200).optional().or(z.literal("")),
});

export const blogPublishedAtField = z.coerce.date().optional().nullable();

export const createBlogSchema = z.object({
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
  excerpt: z.string().trim().max(300, "Excerpt must be at most 300 characters").optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().trim().max(2048, "Image URL is too long").optional().or(z.literal("")),
  status: z.enum(blogStatusValues).default("DRAFT"),
  categoryName: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category name is too long")
    .optional(),
  tags: z.array(z.string()).optional(),
  publishedAt: blogPublishedAtField,
  seo: blogSeoSchema.optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be at most 200 characters"),
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(200, "Slug must be at most 200 characters"),
    excerpt: z.string().trim().max(300).optional(),
    content: z.string().min(1),
    featuredImage: z.string().trim().max(2048).optional().or(z.literal("")),
    status: z.enum(blogStatusValues),
    categoryName: z.string().trim().min(1).max(100).optional(),
    tags: z.array(z.string()).optional(),
    publishedAt: blogPublishedAtField,
    seo: blogSeoSchema.optional(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
