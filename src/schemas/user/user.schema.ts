import { z } from "zod";

export const userRoleValues = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;
export const userStatusValues = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must be at most 128 characters long")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  email: z.email("A valid email is required").trim().toLowerCase(),
  password: passwordField,
  role: z.enum(userRoleValues).default("EDITOR"),
  status: z.enum(userStatusValues).default("ACTIVE"),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.email("A valid email is required").trim().toLowerCase(),
    password: passwordField,
    role: z.enum(userRoleValues),
    status: z.enum(userStatusValues),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
