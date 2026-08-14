import { z } from "zod";

import { contentStatusSchema, displayOrderSchema, urlField } from "@/schemas/common/content.schema";

export const ctaLabelField = z
  .string()
  .trim()
  .max(100, "CTA label must be at most 100 characters")
  .optional()
  .or(z.literal(""));

export const bannerDateField = z.coerce.date().optional().nullable();

export const createBannerSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be at most 200 characters"),
    subtitle: z.string().trim().max(300, "Subtitle must be at most 300 characters").optional(),
    description: z.string().trim().max(5000, "Description is too long").optional(),
    imageUrl: z.string().trim().min(1, "Image URL is required").max(2048, "Image URL is too long"),
    linkUrl: urlField,
    ctaLabel: ctaLabelField,
    startDate: bannerDateField,
    endDate: bannerDateField,
    status: contentStatusSchema.default("DRAFT"),
    displayOrder: displayOrderSchema,
  })
  .refine(
    (value) =>
      !value.startDate || !value.endDate || value.endDate >= value.startDate,
    {
      message: "End date must be on or after the start date",
      path: ["endDate"],
    },
  );

export const updateBannerSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be at most 200 characters"),
    subtitle: z.string().trim().max(300).optional(),
    description: z.string().trim().max(5000).optional(),
    imageUrl: z.string().trim().min(1, "Image URL is required").max(2048),
    linkUrl: urlField,
    ctaLabel: ctaLabelField,
    startDate: bannerDateField,
    endDate: bannerDateField,
    status: contentStatusSchema,
    displayOrder: z.number().int().min(0),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  })
  .refine(
    (value) => {
      if (value.startDate === undefined || value.endDate === undefined) {
        return true;
      }
      return !value.startDate || !value.endDate || value.endDate >= value.startDate;
    },
    {
      message: "End date must be on or after the start date",
      path: ["endDate"],
    },
  );

export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;