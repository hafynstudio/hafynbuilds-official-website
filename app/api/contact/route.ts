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

const EMAIL_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * Small inline-stroke icons for field labels. Inline SVG with explicit
 * width/height so they render in Gmail/Outlook.com (no external image, no
 * emoji font dependency). Outlook for Windows degrades to no icon but the
 * label text still carries the meaning.
 */
function emailIcon(
  kind: "mail" | "phone" | "briefcase" | "clock" | "tag" | "trend" | "doc"
): string {
  const paths: Record<string, string> = {
    mail: '<path d="M3 5h18v14H3z" /><path d="m3 6 9 7 9-7" />',
    phone:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />',
    briefcase:
      '<rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 13h18" />',
    clock: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />',
    tag: '<path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" /><circle cx="7.5" cy="7.5" r="1.5" />',
    trend: '<path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" />',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />',
  };
  return (
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:-2px;">' +
    '<g stroke="#60a5fa" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    paths[kind] +
    "</g></svg>"
  );
}

/** True only for the two top budget bands — PKR 100k–250k and PKR 250k+. */
const HIGH_VALUE_BUDGET = /(100k\s*–\s*250k|250k\+)/;
function isHighValueBudget(budgetLabel: string): boolean {
  return HIGH_VALUE_BUDGET.test(budgetLabel);
}

/** One field = small-caps muted label above a high-contrast value. */
function fieldBlock(label: string, glyph: string, valueHtml: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%">
              <tr>
                <td style="font-family:${EMAIL_FONT_STACK};font-size:10px;line-height:14px;letter-spacing:0.09em;font-weight:600;color:#64748b;">${glyph}&nbsp;${label}</td>
              </tr>
              <tr>
                <td style="padding-top:7px;font-family:${EMAIL_FONT_STACK};font-size:14px;line-height:21px;font-weight:500;color:#e2e8f0;">${valueHtml}</td>
              </tr>
            </table>`;
}

/** Thin 1px slate rule between sections. */
function emailDivider(): string {
  return `<tr>
    <td height="1" style="height:1px;font-size:0;line-height:0;background-color:#1e293b;border-top:1px solid #1e293b;">&nbsp;</td>
  </tr>`;
}

/** Clean, readable internal lead notification. Not a marketing email. */

function buildLeadEmail(input: LeadEmailInput): string {

  const e = escapeHtml;

  const isHighValue = input.budgetLabel.includes("100k") || input.budgetLabel.includes("250k");

  const compactFields: Array<[string, string]> = [];

  if (input.phone) compactFields.push(["Phone", e(input.phone)]);

  compactFields.push(["Timeline", e(input.timelineLabel)]);

  const compactRow = compactFields

    .map(

      ([label, value]) => `

        <td width="50%" valign="top" style="padding:0 8px 0 0;">

          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">${label}</p>

          <p style="margin:0;color:#f3f4f6;font-size:15px;font-weight:500;">${value}</p>

        </td>`

    )

    .join("");

  return `<!DOCTYPE html>

<html lang="en">

  <head>

    <meta charset="UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <title>New HAFYN Website Lead</title>

    <!--[if mso]>

    <style type="text/css">

      table { border-collapse: collapse; }

    </style>

    <![endif]-->

  </head>

  <body style="margin:0;padding:0;background-color:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#030712" style="background-color:#030712;">

      <tr>

        <td align="center" style="padding:40px 16px;">

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

            <tr>

              <td style="padding:0 4px 20px;">

                <table role="presentation" cellpadding="0" cellspacing="0" border="0">

                  <tr>

                    <td width="32" height="32" bgcolor="#2563eb" style="width:32px;height:32px;background-color:#2563eb;border-radius:8px;text-align:center;vertical-align:middle;">

                      <span style="color:#ffffff;font-size:15px;font-weight:700;line-height:32px;font-family:-apple-system,Arial,sans-serif;">H</span>

                    </td>

                    <td style="padding-left:10px;color:#f9fafb;font-size:15px;font-weight:700;letter-spacing:0.02em;">

                      HAFYN <span style="color:#9ca3af;font-weight:400;">BUILDS</span>

                    </td>

                  </tr>

                </table>

              </td>

            </tr>

            <tr>

              <td bgcolor="#0b1220" style="background-color:#0b1220;border:1px solid #1f2937;border-radius:16px;">

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                  <tr>

                    <td height="3" bgcolor="#2563eb" style="background-color:#2563eb;font-size:1px;line-height:3px;border-radius:16px 16px 0 0;">&nbsp;</td>

                  </tr>

                  <tr>

                    <td bgcolor="#111827" style="padding:26px 32px;background-color:#111827;border-bottom:1px solid #1f2937;">

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                        <tr>

                          <td valign="top">

                            <p style="margin:0 0 6px;color:#60a5fa;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">&#9993;&nbsp; New build request</p>

                            <h1 style="margin:0;color:#ffffff;font-size:23px;font-weight:700;letter-spacing:-0.01em;">${e(

                              input.name

                            )}</h1>

                          </td>

                          <td align="right" valign="top">

                            ${

                              isHighValue

                                ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#422006" style="background-color:#422006;border:1px solid #92400e;border-radius:20px;padding:6px 12px;"><span style="color:#fbbf24;font-size:11px;font-weight:700;letter-spacing:0.03em;">&#9733; HIGH-VALUE</span></td></tr></table>`

                                : `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#052e16" style="background-color:#052e16;border:1px solid #14532d;border-radius:20px;padding:6px 14px;"><span style="color:#4ade80;font-size:12px;font-weight:600;">&#9679;&nbsp; Lead</span></td></tr></table>`

                            }

                          </td>

                        </tr>

                      </table>

                    </td>

                  </tr>

                  <tr>

                    <td style="padding:24px 32px 0;">

                      <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">&#9993;&nbsp; Email</p>

                      <p style="margin:0 0 18px;"><a href="mailto:${e(

                        input.email

                      )}" style="color:#60a5fa;font-size:15px;font-weight:500;text-decoration:none;">${e(

    input.email

  )}</a></p>

                      ${

                        input.company

                          ? `<p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">&#128188;&nbsp; Company</p><p style="margin:0 0 18px;color:#f3f4f6;font-size:15px;font-weight:500;">${e(

                              input.company

                            )}</p>`

                          : ""

                      }

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">

                        <tr>${compactRow}</tr>

                      </table>

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 4px;">

                        <tr>

                          <td width="50%" style="padding:0 8px 0 0;">

                            <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">&#128188;&nbsp; Service</p>

                            <p style="margin:0;color:#f3f4f6;font-size:15px;font-weight:500;">${e(

                              input.projectTypeLabel

                            )}</p>

                          </td>

                          <td width="50%">

                            <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">&#128176;&nbsp; Budget</p>

                            <p style="margin:0;color:#f3f4f6;font-size:15px;font-weight:500;">${e(

                              input.budgetLabel

                            )}</p>

                          </td>

                        </tr>

                      </table>

                    </td>

                  </tr>

                  <tr>

                    <td style="padding:20px 32px 28px;">

                      <p style="margin:0 0 10px;color:#6b7280;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">&#128172;&nbsp; Message</p>

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                        <tr>

                          <td bgcolor="#111827" style="background-color:#111827;border:1px solid #1f2937;border-left:3px solid #2563eb;border-radius:8px;padding:16px 18px;">

                            <p style="margin:0;color:#e5e7eb;font-size:15px;line-height:1.6;">${e(

                              input.message

                            ).replace(/\n/g, "<br/>")}</p>

                          </td>

                        </tr>

                      </table>

                    </td>

                  </tr>

                  <tr>

                    <td style="padding:0 32px 32px;">

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">

                        <tr>

                          <td bgcolor="#2563eb" style="background-color:#2563eb;border-radius:8px;">

                            <a href="mailto:${e(

                              input.email

                            )}" style="display:inline-block;padding:12px 22px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;font-family:-apple-system,Arial,sans-serif;">Reply to ${e(

    input.name

  )} &rarr;</a>

                          </td>

                        </tr>

                      </table>

                    </td>

                  </tr>

                  <tr>

                    <td bgcolor="#080d17" style="padding:16px 32px;background-color:#080d17;border-top:1px solid #1f2937;border-radius:0 0 16px 16px;">

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                        <tr>

                          <td style="color:#6b7280;font-size:12px;">Submitted ${e(input.submittedAt)}</td>

                          <td align="right" style="color:#6b7280;font-size:12px;">

                            <a href="${e(

                              input.source

                            )}" style="color:#6b7280;text-decoration:none;">${e(input.source).replace(

    /^https?:\/\//,

    ""

  )}</a>

                          </td>

                        </tr>

                      </table>

                    </td>

                  </tr>

                </table>

              </td>

            </tr>

            <tr>

              <td style="padding:20px 4px 0;text-align:center;">

                <p style="margin:0;color:#4b5563;font-size:12px;">HAFYN BUILDS &middot; Building tomorrow. Engineering excellence.</p>

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
