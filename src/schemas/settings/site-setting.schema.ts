import { z } from "zod";

export const createSiteSettingSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Key is required")
    .max(100, "Key must be at most 100 characters")
    .regex(/^[a-z0-9_]+$/, "Key can only contain lowercase letters, numbers and underscores"),
  value: z.string().trim().max(5000, "Value is too long"),
  group: z.string().trim().max(100, "Group is too long").optional(),
  description: z.string().trim().max(500, "Description is too long").optional(),
});

export const updateSiteSettingSchema = z
  .object({
    key: z.string().trim().min(1).max(100).regex(/^[a-z0-9_]+$/),
    value: z.string().trim().max(5000),
    group: z.string().trim().max(100).optional(),
    description: z.string().trim().max(500).optional(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateSiteSettingInput = z.infer<typeof createSiteSettingSchema>;
export type UpdateSiteSettingInput = z.infer<typeof updateSiteSettingSchema>;