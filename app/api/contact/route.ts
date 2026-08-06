import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createHash } from "node:crypto";
import { contactSchema } from "@/lib/contact-schema";

// ---------------------------------------------------------------------------
// Delivery — Resend email. A submission is only ever reported as accepted
// after Resend acknowledges the email. The API key lives server-side only
// (never in the browser, never in NEXT_PUBLIC_*). No API key / provider
// internals / user data ever reach the client or the logs.
//
// Defaults:
//   RESEND_FROM_EMAIL = HAFYN <onboarding@resend.dev>  (Resend test sender)
//   RESEND_TO_EMAIL   = hafynbuilds@gmail.com          (real lead inbox)
// These are overridable via env so an environment can swap values (e.g. a
// verified sending domain, or a different inbox) with zero code changes.
// The Vercel hostname (hafynbuilds.vercel.app) is never used as a sending
// domain.
// ---------------------------------------------------------------------------
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "HAFYN <onboarding@resend.dev>";
const RESEND_TO_EMAIL = process.env.RESEND_TO_EMAIL ?? "hafynbuilds@gmail.com";

let resendClient: Resend | null = null;

/** Lazily constructed so a missing key never instantiates a broken client. */
function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(RESEND_API_KEY);
  return resendClient;
}

const MAX_BODY_BYTES = 64 * 1024; // 64 KB — far above any real message
const UNAVAILABLE_MESSAGE =
  "We couldn't process your message right now. Please try again in a moment, or reach us directly on WhatsApp or email.";

// Human-readable labels for the enum values — mirrored from the client form
// so the internal lead email reads clearly.
const PROJECT_TYPE_LABELS: Record<string, string> = {
  website: "Website",
  "web-app": "Web App",
  software: "Software / SaaS",
  "ai-system": "AI System",
  enterprise: "Enterprise",
  "not-sure": "Not Sure Yet",
};
const BUDGET_LABELS: Record<string, string> = {
  "under-25k": "Under PKR 25,000",
  "25k-50k": "PKR 25k – 50k",
  "50k-100k": "PKR 50k – 100k",
  "100k-250k": "PKR 100k – 250k",
  "250k-plus": "PKR 250k+",
};
const TIMELINE_LABELS: Record<string, string> = {
  immediately: "Immediately",
  "within-1-month": "Within 1 Month",
  "1-3-months": "1–3 Months",
  flexible: "Flexible",
};

/** Escape untrusted user input for safe HTML interpolation. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface LeadEmailInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectTypeLabel: string;
  budgetLabel: string;
  timelineLabel: string;
  message: string;
  submittedAt: string;
  source: string;
}

/** Clean, readable internal lead notification. Not a marketing email. */
function buildLeadEmail(input: LeadEmailInput): string {
  const e = escapeHtml;
  const rows: Array<[string, string]> = [
    ["Name", e(input.name)],
    ["Email", e(input.email)],
    ...(input.company ? [["Company", e(input.company)] as [string, string]] : []),
    ...(input.phone ? [["Phone", e(input.phone)] as [string, string]] : []),
    ["Requested service", e(input.projectTypeLabel)],
    ["Budget range", e(input.budgetLabel)],
    ["Timeline", e(input.timelineLabel)],
    ["Message", e(input.message).replace(/\n/g, "<br/>")],
    ["Submitted", e(input.submittedAt)],
    ["Source", e(input.source)],
  ];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:600;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;vertical-align:top;">${value}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:20px 24px;background-color:#111827;color:#ffffff;">
                <h1 style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.02em;">NEW HAFYN WEBSITE LEAD</h1>
                <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">hafynbuilds.vercel.app</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                  ${body}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

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

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

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
 * Handles build request submissions. The payload is validated server-side,
 * then delivered as an email through Resend. A submission is only ever
 * reported as accepted after Resend acknowledges the email.
 *
 * No form data (name, email, phone, company, message, project details) and
 * no client IP is written to server logs. Only non-sensitive outcome lines
 * are emitted for operational visibility.
 */
export async function POST(req: Request) {
  try {
    // 1. Method gate — reject anything but POST defensively (the router
    //    already 405s other verbs, this is belt-and-suspenders).
    if (req.method !== "POST") {
      console.info("[contact] method_not_allowed");
      return NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }

    // 2. Rate limit before doing any expensive work.
    const ip = clientIp(req);
    if (isRateLimited(ip)) {
      console.info("[contact] rate_limited");
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
      console.info("[contact] validation_failed");
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // 5. Honeypot — a bot-filled hidden field is silently treated as invalid.
    if (data.hp_field && data.hp_field.length > 0) {
      console.info("[contact] honeypot_rejected");
      return NextResponse.json(
        { success: false, message: "Validation failed" },
        { status: 400 }
      );
    }

    // 6. Configuration guard — no API key means we cannot deliver. Honest
    //    error; never a false "sent" message.
    const client = getResend();
    if (!client) {
      console.error("[contact] config_missing");
      return NextResponse.json(
        { success: false, message: UNAVAILABLE_MESSAGE },
        { status: 500 }
      );
    }

    // 7. Idempotency — derive a stable key from the submission content so an
    //    accidental double-submission of identical content is delivered once
    //    within Resend's idempotency window. Never derived from email alone.
    const idempotencyKey = createHash("sha256")
      .update(
        JSON.stringify([
          data.name,
          data.email,
          data.phone ?? "",
          data.company ?? "",
          data.projectType,
          data.budgetRange,
          data.timeline,
          data.message,
        ])
      )
      .digest("hex");

    // 8. Build + send the lead email through Resend. User input goes into
    //    the HTML body escaped, and only into replyTo (never `from`).
    const subject = `New HAFYN Website Lead from ${data.name.replace(/[\r\n]+/g, " ").trim()}`;
    const submittedAt = new Date().toISOString();
    const source = req.headers.get("origin") ?? "https://hafynbuilds.vercel.app";

    const { data: _sendData, error } = await client.emails.send(
      {
        from: RESEND_FROM_EMAIL,
        to: RESEND_TO_EMAIL,
        replyTo: data.email,
        subject,
        html: buildLeadEmail({
          name: data.name,
          email: data.email,
          company: data.company,
          phone: data.phone,
          projectTypeLabel: PROJECT_TYPE_LABELS[data.projectType] ?? data.projectType,
          budgetLabel: BUDGET_LABELS[data.budgetRange] ?? data.budgetRange,
          timelineLabel: TIMELINE_LABELS[data.timeline] ?? data.timeline,
          message: data.message,
          submittedAt,
          source,
        }),
      },
      { idempotencyKey }
    );

    if (error || !_sendData) {
      // Provider failed — log only the outcome, never provider internals or
      // user data.
      console.error("[contact] resend_failed");
      return NextResponse.json(
        { success: false, message: UNAVAILABLE_MESSAGE },
        { status: 500 }
      );
    }

    // 9. Resend acknowledged the email. Only now is the request accepted.
    console.info("[contact] email_sent");
    return NextResponse.json({ success: true });
  } catch {
    // Generic safety net — log nothing sensitive, return nothing internal.
    console.error("[contact] unexpected_error");
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
