import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Contact Form Validation Schema
 * Shared by client (for real-time feedback) and server (for security).
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
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
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
  message: z.string().min(20, "Please tell us a bit more (min 20 characters)"),
  hp_field: z.string().max(0, { message: "Bot detected" }).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * POST /api/contact
 * Handles build request submissions. Scaffold-only for Phase 16 per
 * Decision D63 — switching to Resend/Postmark later requires editing
 * only the persistence block below.
 */
export async function POST(req: Request) {
  try {
    // Lightweight rate limiting (scaffold — Vercel KV integration deferred)
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    console.log(`[Contact API] Request from IP: ${ip}`);

    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Honeypot check — if a bot filled the hidden field, silently reject
    if (data.hp_field && data.hp_field.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed" },
        { status: 400 }
      );
    }

    // Persistence — log to server console for now.
    // Replace this block with Resend/Postmark send + DB insert later.
    console.log("-----------------------------------------");
    console.log("NEW BUILD REQUEST RECEIVED");
    console.log("Time:    ", new Date().toISOString());
    console.log("From:    ", data.name, `(${data.email})`);
    console.log("Phone:   ", data.phone || "—");
    console.log("Company: ", data.company || "—");
    console.log("Project: ", data.projectType);
    console.log("Budget:  ", data.budgetRange);
    console.log("Timeline:", data.timeline);
    console.log("Message: ", data.message);
    console.log("-----------------------------------------");

    return NextResponse.json({
      success: true,
      message: "Build request received successfully.",
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}