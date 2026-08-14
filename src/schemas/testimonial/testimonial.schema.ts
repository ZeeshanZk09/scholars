import { z } from "zod";

import { contentStatusSchema, displayOrderSchema, urlField } from "@/schemas/common/content.schema";

export const testimonialTypeValues = ["STUDENT", "PARENT", "ALUMNI"] as const;

const coreSchema = {
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  role: z.string().trim().max(120, "Role must be at most 120 characters").optional(),
  type: z.enum(testimonialTypeValues),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message is too long"),
  imageUrl: urlField,
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .default(5),
  status: contentStatusSchema.default("DRAFT"),
  displayOrder: displayOrderSchema,
};

export const createTestimonialSchema = z.object({ ...coreSchema });

export const updateTestimonialSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    role: z.string().trim().max(120).optional(),
    type: z.enum(testimonialTypeValues),
    message: z.string().trim().min(1).max(5000),
    imageUrl: urlField,
    rating: z.number().int().min(1).max(5),
    status: contentStatusSchema,
    displayOrder: z.number().int().min(0),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
