import { z } from "zod";

import { contentStatusSchema, displayOrderSchema } from "@/schemas/common/content.schema";

const levelCoreSchema = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120, "Slug must be at most 120 characters")
    .optional(),
  description: z.string().trim().max(5000, "Description is too long").optional(),
  status: contentStatusSchema.default("DRAFT"),
  displayOrder: displayOrderSchema,
};

export const createAcademicLevelSchema = z.object({ ...levelCoreSchema });

export const updateAcademicLevelSchema = z
  .object({ ...levelCoreSchema })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

const classCoreSchema = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120, "Slug must be at most 120 characters")
    .optional(),
  description: z.string().trim().max(5000, "Description is too long").optional(),
  eligibility: z.string().trim().max(2000, "Eligibility is too long").optional(),
  learningOutcomes: z.string().trim().max(10000, "Learning outcomes are too long").optional(),
  levelId: z.string().trim().min(1, "Academic level is required"),
  status: contentStatusSchema.default("DRAFT"),
  displayOrder: displayOrderSchema,
};

export const createSchoolClassSchema = z.object({ ...classCoreSchema });

export const updateSchoolClassSchema = z
  .object({ ...classCoreSchema })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateAcademicLevelInput = z.infer<typeof createAcademicLevelSchema>;
export type UpdateAcademicLevelInput = z.infer<typeof updateAcademicLevelSchema>;
export type CreateSchoolClassInput = z.infer<typeof createSchoolClassSchema>;
export type UpdateSchoolClassInput = z.infer<typeof updateSchoolClassSchema>;
