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

// ---------------------------------------------------------------------------
// Delivery — real persistence is required before a submission is reported as
// accepted. Phase 2 hardening: the route never claims success for a payload
// that was only logged. Delivery is an outbound webhook whose URL is set via
// the CONTACT_DELIVERY_WEBHOOK_URL environment variable (any receiver the
// business controls: Resend/Postmark webhook, a CRM endpoint, Zapier/Make,
// a serverless function, etc.). If the variable is not configured the route
// returns an honest 503 and the UI surfaces a failure state with fallback
// contact channels — never a false "sent" message.
// ---------------------------------------------------------------------------
const DELIVERY_WEBHOOK_URL = process.env.CONTACT_DELIVERY_WEBHOOK_URL;

const DELIVERY_TIMEOUT_MS = 8000;
const MAX_BODY_BYTES = 64 * 1024; // 64 KB — far above any real message
const UNAVAILABLE_MESSAGE =
  "We couldn't process your message right now. Please try again in a moment, or reach us directly on WhatsApp or email.";

// ---------------------------------------------------------------------------
// Per-instance best-effort rate limiting.
//
// HONEST LIMITATION (documented deliberately): this limiter lives in server
// memory, so it is only effective within a single warm instance. On a
// single-instance Node deployment (`next start`) it provides real protection.
// On serverless platforms (Vercel) each instance has its own map and cold
// starts reset it, so it is best-effort per-instance throttling, NOT
// distributed rate limiting. For distributed limiting, configure Vercel KV /
// Upstash / an external store and replace the in-memory window below.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 10; // max submissions per window per IP

const rateLimitBuckets = new Map<
  string,
  { count: number; resetAt: number }
>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;

  // Opportunistic cleanup so the map cannot grow unbounded.
  if (rateLimitBuckets.size > 10_000) {
    for (const [key, value] of rateLimitBuckets) {
      if (now >= value.resetAt) rateLimitBuckets.delete(key);
    }
  }

  return bucket.count > RATE_LIMIT_MAX;
}

/** First public IP from x-forwarded-for, or a stable fallback. Never logged. */
function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0].trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * POST /api/contact
 * Handles build request submissions. The payload is validated, then
 * delivered to the configured webhook. A submission is only ever reported
 * as accepted after the delivery target acknowledges it with a 2xx.
 *
 * No form data (name, email, phone, company, message, project details) and
 * no client IP is written to server logs. Only a non-sensitive outcome line
 * is emitted for operational visibility.
 */
export async function POST(req: Request) {
  try {
    // 1. Method gate — reject anything but POST defensively (the router
    //    already 405s other verbs, this is belt-and-suspenders).
    if (req.method !== "POST") {
      return NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }

    // 2. Rate limit before doing any expensive work.
    const ip = clientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Request size guard — reject oversized bodies before parsing.
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ success: false, message: "Payload too large" }, { status: 413 });
    }

    // 4. Parse + validate. Malformed JSON and invalid payloads both become
    //    clean 4xx responses — never a stack trace, never a 500.
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 });
    }

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // 5. Honeypot — a bot-filled hidden field is silently treated as invalid.
    if (data.hp_field && data.hp_field.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed" },
        { status: 400 }
      );
    }

    // 6. Delivery. No delivery target configured → honest 503, nothing logged.
    if (!DELIVERY_WEBHOOK_URL) {
      return NextResponse.json(
        { success: false, message: UNAVAILABLE_MESSAGE },
        { status: 503 }
      );
    }

    let deliveryRes: Response;
    try {
      deliveryRes = await fetch(DELIVERY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          company: data.company ?? null,
          projectType: data.projectType,
          budgetRange: data.budgetRange,
          timeline: data.timeline,
          message: data.message,
        }),
        signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      });
    } catch {
      // Network failure / timeout — the delivery target never acknowledged.
      return NextResponse.json(
        { success: false, message: UNAVAILABLE_MESSAGE },
        { status: 502 }
      );
    }

    if (!deliveryRes.ok) {
      // Delivery target rejected the payload. Log only the status code —
      // never the body, the URL, or any form data.
      console.error(`[Contact API] Delivery target responded ${deliveryRes.status}`);
      return NextResponse.json(
        { success: false, message: UNAVAILABLE_MESSAGE },
        { status: 502 }
      );
    }

    // 7. The delivery target acknowledged the submission. Only now is the
    //    request reported as accepted.
    console.info("[Contact API] Submission delivered");
    return NextResponse.json({
      success: true,
      message: "Build request received successfully.",
    });
  } catch {
    // Generic safety net — log nothing sensitive, return nothing internal.
    console.error("[Contact API] Unexpected error");
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
