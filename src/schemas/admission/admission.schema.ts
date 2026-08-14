import { z } from "zod";

export const admissionCategoryValues = [
  "SCHOOL",
  "COLLEGE",
  "COACHING",
  "COMPUTER_COURSES",
] as const;

export const admissionStatusValues = ["COMING_SOON", "OPEN", "CLOSED"] as const;

const nullableText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional();

export const createAdmissionPeriodSchema = z.object({
  sessionId: z.string().trim().min(1, "Academic session is required"),
  category: z.enum(admissionCategoryValues),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: nullableText(5000, "Description is too long"),
  openingDate: z.iso.datetime().optional(),
  closingDate: z.iso.datetime().optional(),
  status: z.enum(admissionStatusValues).default("COMING_SOON"),
  isActive: z.boolean().default(false),
});

export const updateAdmissionPeriodSchema = z
  .object({
    sessionId: z.string().trim().min(1),
    category: z.enum(admissionCategoryValues),
    title: z.string().trim().min(1).max(200),
    description: nullableText(5000, "Description is too long"),
    openingDate: z.iso.datetime().optional(),
    closingDate: z.iso.datetime().optional(),
    status: z.enum(admissionStatusValues),
    isActive: z.boolean(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const createAdmissionRequirementSchema = z.object({
  admissionPeriodId: z.string().trim().min(1, "Admission period ID is required"),
  eligibility: z.string().trim().max(10000).optional(),
  requiredDocuments: z.string().trim().max(10000).optional(),
  applicationProcess: z.string().trim().max(10000).optional(),
  importantDates: z.string().trim().max(5000).optional(),
  feeInformation: z.string().trim().max(5000).optional(),
  prospectusUrl: z.string().trim().max(2048).optional().or(z.literal("")),
  instructions: z.string().trim().max(5000).optional(),
  contactInformation: z.string().trim().max(5000).optional(),
});

export const updateAdmissionRequirementSchema = createAdmissionRequirementSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const createAdmissionInquirySchema = z.object({
  admissionPeriodId: z.string().trim().min(1, "Admission period is required").optional(),
  studentName: z
    .string()
    .trim()
    .min(1, "Student name is required")
    .max(120, "Student name must be at most 120 characters"),
  parentGuardianName: z.string().trim().max(120).optional(),
  phone: z.string().trim().min(7, "Phone number is too short").max(20, "Phone number is too long"),
  email: z.email("A valid email is required").trim().optional().or(z.literal("")),
  interestedProgram: z.string().trim().max(200).optional(),
  classOrCourse: z.string().trim().max(200).optional(),
  message: z.string().trim().max(5000).optional(),
});

export const createInquiryStatusSchema = z.object({
  status: z.enum(["PENDING", "CONTACTED", "CLOSED"]),
});

export type CreateAdmissionPeriodInput = z.infer<typeof createAdmissionPeriodSchema>;
export type UpdateAdmissionPeriodInput = z.infer<typeof updateAdmissionPeriodSchema>;
export type CreateAdmissionRequirementInput = z.infer<typeof createAdmissionRequirementSchema>;
export type UpdateAdmissionRequirementInput = z.infer<typeof updateAdmissionRequirementSchema>;
export type CreateAdmissionInquiryInput = z.infer<typeof createAdmissionInquirySchema>;
