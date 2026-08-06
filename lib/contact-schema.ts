import { z } from "zod";

/**
 * Contact Form Validation Schema
 * Shared by client (real-time feedback) and server (authoritative security).
 * Lives in its own module so the client form never imports the API route
 * (which pulls in server-only dependencies like the Resend SDK).
 *
 * projectType values:
 *   website     — marketing/business/portfolio sites (static or CMS)
 *   web-app     — dashboards, tools, SaaS-style products with logins
 *   software    — desktop, backend systems, custom software
 *   ai-system   — AI agents, ML systems, automation with AI
 *   enterprise  — large-scale multi-system integrations
 *   not-sure    — user hasn't decided yet; we help scope it
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(254, "Email is too long"),
  phone: z.string().trim().max(40, "Phone is too long").optional(),
  company: z.string().trim().max(120, "Company is too long").optional(),
  projectType: z.enum([
    "website",
    "web-app",
    "software",
    "ai-system",
    "enterprise",
    "not-sure",
  ]),
  budgetRange: z.enum([
    "under-25k",
    "25k-50k",
    "50k-100k",
    "100k-250k",
    "250k-plus",
  ]),
  timeline: z.enum([
    "immediately",
    "within-1-month",
    "1-3-months",
    "flexible",
  ]),
  message: z.string().trim().min(20, "Please tell us a bit more (min 20 characters)").max(5000, "Message is too long"),
  hp_field: z.string().max(0, { message: "Bot detected" }).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
