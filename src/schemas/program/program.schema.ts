import { z } from "zod";

import { contentStatusSchema, displayOrderSchema } from "@/schemas/common/content.schema";

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
  groupName: z.string().trim().max(200).optional(),
  description: z.string().trim().max(10000).optional(),
  subjects: z.string().trim().max(2000).optional(),
  eligibility: z.string().trim().max(2000).optional(),
  duration: z.string().trim().max(200).optional(),
  admissionRequirements: z.string().trim().max(5000).optional(),
  status: contentStatusSchema.default("DRAFT"),
  displayOrder: displayOrderSchema,
};

export const createProgramSchema = z.object({ ...coreSchema });

export const updateProgramSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200),
    groupName: z.string().trim().max(200).optional(),
    description: z.string().trim().max(10000).optional(),
    subjects: z.string().trim().max(2000).optional(),
    eligibility: z.string().trim().max(2000).optional(),
    duration: z.string().trim().max(200).optional(),
    admissionRequirements: z.string().trim().max(5000).optional(),
    status: contentStatusSchema,
    displayOrder: z.number().int().min(0),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
