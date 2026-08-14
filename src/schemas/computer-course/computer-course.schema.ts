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
  shortDescription: z.string().trim().max(2000).optional(),
  detailedDescription: z.string().trim().max(20000).optional(),
  duration: z.string().trim().max(200).optional(),
  eligibility: z.string().trim().max(2000).optional(),
  courseOutline: z.string().trim().min(1, "Course outline is required").max(20000),
  instructor: z.string().trim().max(200).optional(),
  timing: z.string().trim().max(500).optional(),
  fee: z.string().trim().max(500).optional(),
  admissionStatus: z.string().trim().max(200).optional(),
  isFeatured: z.boolean().default(false),
  status: contentStatusSchema.default("DRAFT"),
  displayOrder: displayOrderSchema,
};

export const createComputerCourseSchema = z.object({ ...coreSchema });

export const updateComputerCourseSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200),
    shortDescription: z.string().trim().max(2000).optional(),
    detailedDescription: z.string().trim().max(20000).optional(),
    duration: z.string().trim().max(200).optional(),
    eligibility: z.string().trim().max(2000).optional(),
    courseOutline: z.string().trim().min(1).max(20000),
    instructor: z.string().trim().max(200).optional(),
    timing: z.string().trim().max(500).optional(),
    fee: z.string().trim().max(500).optional(),
    admissionStatus: z.string().trim().max(200).optional(),
    isFeatured: z.boolean(),
    status: contentStatusSchema,
    displayOrder: z.number().int().min(0),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateComputerCourseInput = z.infer<typeof createComputerCourseSchema>;
export type UpdateComputerCourseInput = z.infer<typeof updateComputerCourseSchema>;
