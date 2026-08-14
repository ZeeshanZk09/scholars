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
  category: z.string().trim().max(120).optional(),
  description: z.string().trim().max(10000).optional(),
  targetStudents: z.string().trim().max(2000).optional(),
  subjects: z.string().trim().max(2000).optional(),
  duration: z.string().trim().max(200).optional(),
  timing: z.string().trim().max(500).optional(),
  feeInformation: z.string().trim().max(2000).optional(),
  admissionStatus: z.string().trim().max(200).optional(),
  status: contentStatusSchema.default("DRAFT"),
  displayOrder: displayOrderSchema,
};

export const createCoachingProgramSchema = z.object({ ...coreSchema });

export const updateCoachingProgramSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200),
    category: z.string().trim().max(120).optional(),
    description: z.string().trim().max(10000).optional(),
    targetStudents: z.string().trim().max(2000).optional(),
    subjects: z.string().trim().max(2000).optional(),
    duration: z.string().trim().max(200).optional(),
    timing: z.string().trim().max(500).optional(),
    feeInformation: z.string().trim().max(2000).optional(),
    admissionStatus: z.string().trim().max(200).optional(),
    status: contentStatusSchema,
    displayOrder: z.number().int().min(0),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateCoachingProgramInput = z.infer<typeof createCoachingProgramSchema>;
export type UpdateCoachingProgramInput = z.infer<typeof updateCoachingProgramSchema>;
