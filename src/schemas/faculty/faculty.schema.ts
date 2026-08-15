import { z } from "zod";

export const createFacultySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  designation: z.string().max(100).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  qualification: z.string().max(150).optional().nullable(),
  experience: z.string().max(100).optional().nullable(),
  subject: z.string().max(100).optional().nullable(),
  profileImageUrl: z.url("Must be a valid URL").optional().nullable(),
  biography: z.string().optional().nullable(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("DRAFT"),
  displayOrder: z.coerce.number().int().default(0),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;

export const updateFacultySchema = createFacultySchema.partial();

export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
