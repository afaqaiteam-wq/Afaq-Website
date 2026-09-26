import { z } from "zod";

/** Shared by the contact form (instant feedback) and the API route (the real check). */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "required").max(120),
  email: z.string().trim().min(1, "required").email("invalidEmail").max(200),
  company: z.string().trim().max(160).optional().default(""),
  service: z.string().trim().min(1, "required").max(80),
  message: z.string().trim().min(1, "required").min(20, "tooShort").max(5000),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().max(0).optional().default(""),
  locale: z.enum(["en", "ar"]).optional().default("en"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "company" | "service" | "message";
export type ContactErrorKey = "required" | "invalidEmail" | "tooShort";
