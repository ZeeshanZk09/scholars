import { z } from "zod";

import { contentStatusSchema, displayOrderSchema, urlField } from "@/schemas/common/content.schema";

const coreSchema = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200, "Slug must be at most 200 characters")
    .optional(),
  description: z.string().trim().max(5000).optional(),
  imageUrl: urlField,
  icon: z.string().trim().max(100, "Icon must be at most 100 characters").optional(),
  status: contentStatusSchema.default("DRAFT"),
  displayOrder: displayOrderSchema,
};

export const createFacilitySchema = z.object({ ...coreSchema });

export const updateFacilitySchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200),
    description: z.string().trim().max(5000).optional(),
    imageUrl: urlField,
    icon: z.string().trim().max(100).optional(),
    status: contentStatusSchema,
    displayOrder: z.number().int().min(0),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityInput = z.infer<typeof updateFacilitySchema>;
