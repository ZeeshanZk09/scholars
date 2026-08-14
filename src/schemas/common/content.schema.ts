import { z } from "zod";

export const contentStatusValues = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const contentStatusSchema = z.enum(contentStatusValues);

export const urlField = z.string().trim().max(2048, "URL is too long").optional().or(z.literal(""));

export const displayOrderSchema = z
  .number()
  .int("Display order must be an integer")
  .min(0, "Display order cannot be negative")
  .default(0);
