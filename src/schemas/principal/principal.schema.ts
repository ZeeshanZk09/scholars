import { z } from "zod";

import { contentStatusSchema, displayOrderSchema, urlField } from "@/schemas/common/content.schema";

const coreSchema = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  designation: z.string().trim().max(120, "Designation must be at most 120 characters").optional(),
  profileImageUrl: urlField,
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
  biography: z.string().trim().max(5000, "Biography is too long").optional(),
  status: contentStatusSchema.default("PUBLISHED"),
  displayOrder: displayOrderSchema,
};

export const createPrincipalSchema = z.object({ ...coreSchema });

export const updatePrincipalSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    designation: z.string().trim().max(120).optional(),
    profileImageUrl: urlField,
    message: z.string().trim().min(1).max(5000),
    biography: z.string().trim().max(5000).optional(),
    status: contentStatusSchema,
    displayOrder: z.number().int().min(0),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreatePrincipalInput = z.infer<typeof createPrincipalSchema>;
export type UpdatePrincipalInput = z.infer<typeof updatePrincipalSchema>;
