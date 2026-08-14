import { z } from "zod";

import { contentStatusSchema, displayOrderSchema } from "@/schemas/common/content.schema";

export const navigationPositionValues = ["main", "footer"] as const;

const coreSchema = {
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(120, "Label must be at most 120 characters"),
  url: z.string().trim().min(1, "URL is required").max(500, "URL is too long"),
  position: z.enum(navigationPositionValues).default("main"),
  parentId: z.string().trim().optional(),
  displayOrder: displayOrderSchema,
  status: contentStatusSchema.default("PUBLISHED"),
};

export const createNavigationItemSchema = z.object({ ...coreSchema });

export const updateNavigationItemSchema = z
  .object({
    label: z.string().trim().min(1).max(120),
    url: z.string().trim().min(1).max(500),
    position: z.enum(navigationPositionValues),
    parentId: z.string().trim().optional(),
    displayOrder: z.number().int().min(0),
    status: contentStatusSchema,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateNavigationItemInput = z.infer<typeof createNavigationItemSchema>;
export type UpdateNavigationItemInput = z.infer<typeof updateNavigationItemSchema>;
