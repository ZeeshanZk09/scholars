import { z } from "zod";

const CONTROL_CHARS_PATTERN = ["\\x00-\\x08", "\\x0B", "\\x0C", "\\x0E-\\x1F", "\\x7F"].join("");
const CONTROL_CHARS = new RegExp(`[${CONTROL_CHARS_PATTERN}]`, "g");

function sanitize(value: string): string {
  return value.replace(CONTROL_CHARS, "");
}

const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(120, "Name must be at most 120 characters")
  .transform(sanitize);

const emailField = z
  .email("A valid email is required")
  .trim()
  .transform((value) => sanitize(value).toLowerCase());

const messageField = z
  .string()
  .trim()
  .min(1, "Message is required")
  .max(5000, "Message is too long")
  .transform(sanitize);

export const createContactMessageSchema = z.object({
  name: nameField,
  email: emailField,
  phone: z.string().trim().max(20, "Phone number is too long").transform(sanitize).optional(),
  subject: z.string().trim().max(200, "Subject is too long").transform(sanitize).optional(),
  message: messageField,
  website: z.string().trim().max(0, "Invalid submission").optional(),
});

export const contactMessageStatusValues = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"] as const;

export const updateContactMessageStatusSchema = z.object({
  status: z.enum(contactMessageStatusValues),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
