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

/**
 * Premium dark-theme lead notification (HAFYN brand). Table-based, inline
 * styles only, bgcolor alongside background-color for Outlook, inline SVG
 * icons, no gradients / no external assets / no JS. Every piece of
 * user-submitted data passes through escapeHtml() before interpolation.
 */
function buildLeadEmail(input: LeadEmailInput): string {
  const e = escapeHtml;
  const isHighValue = isHighValueBudget(input.budgetLabel);

  const mailtoHref =
    "mailto:" +
    e(input.email) +
    "?subject=" +
    encodeURIComponent(`HAFYN project enquiry from ${input.name}`);

  const messageHtml = e(input.message).replace(/\n/g, "<br/>");

  // Gold "high-value lead" badge under the name — draws the founder's eye.
  const highValueBadge = isHighValue
    ? `<tr>
        <td style="padding-top:12px;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>
              <td bgcolor="#3a2a06" style="background-color:#3a2a06;border-radius:6px;padding-top:5px;padding-right:11px;padding-bottom:5px;padding-left:11px;font-family:${EMAIL_FONT_STACK};font-size:10px;line-height:14px;font-weight:700;letter-spacing:0.08em;color:#fbbf24;">&#9733;&nbsp;HIGH-VALUE LEAD</td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  const budgetValue = isHighValue
    ? `<span style="color:#fbbf24;font-weight:700;">${e(input.budgetLabel)}&#9733;</span>`
    : e(input.budgetLabel);

  // Fields grid — email full-width (mailto), compact pairs for company/
  // service and phone/timeline, budget full-width (gold when high value).
  const fields = `
      <tr>
        <td colspan="2" style="padding-top:20px;padding-right:28px;padding-bottom:20px;padding-left:28px;vertical-align:top;">
          ${fieldBlock("EMAIL", emailIcon("mail"), `<a href="${mailtoHref}" style="color:#e2e8f0;text-decoration:underline;text-decoration-color:#475569;text-underline-offset:3px;">${e(input.email)}</a>`)}
        </td>
      </tr>
      <tr>
        <td colspan="2" height="1" style="height:1px;font-size:0;line-height:0;background-color:#1e293b;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding-top:20px;padding-right:16px;padding-bottom:20px;padding-left:28px;vertical-align:top;border-right:1px solid #1e293b;">
          ${fieldBlock("COMPANY", emailIcon("briefcase"), e(input.company || "—"))}
        </td>
        <td style="padding-top:20px;padding-right:28px;padding-bottom:20px;padding-left:16px;vertical-align:top;">
          ${fieldBlock("REQUESTED SERVICE", emailIcon("tag"), e(input.projectTypeLabel))}
        </td>
      </tr>
      <tr>
        <td colspan="2" height="1" style="height:1px;font-size:0;line-height:0;background-color:#1e293b;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding-top:20px;padding-right:16px;padding-bottom:20px;padding-left:28px;vertical-align:top;border-right:1px solid #1e293b;">
          ${fieldBlock("PHONE", emailIcon("phone"), e(input.phone || "—"))}
        </td>
        <td style="padding-top:20px;padding-right:28px;padding-bottom:20px;padding-left:16px;vertical-align:top;">
          ${fieldBlock("TIMELINE", emailIcon("clock"), e(input.timelineLabel))}
        </td>
      </tr>
      <tr>
        <td colspan="2" height="1" style="height:1px;font-size:0;line-height:0;background-color:#1e293b;">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top:20px;padding-right:28px;padding-bottom:20px;padding-left:28px;vertical-align:top;">
          ${fieldBlock("BUDGET RANGE", emailIcon("trend"), budgetValue)}
        </td>
      </tr>`;

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>New lead — ${e(input.name)}</title>
  </head>
  <body style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;background-color:#030712;color:#e2e8f0;font-family:${EMAIL_FONT_STACK};">
    <span style="display:none;font-size:0;line-height:0;max-height:0;mso-hide:all;opacity:0;color:#030712;visibility:hidden;">New lead — ${e(input.projectTypeLabel)} · ${e(input.name)}</span>
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#030712" style="width:100%;background-color:#030712;">
      <tr>
        <td align="center" bgcolor="#030712" style="background-color:#030712;padding-top:36px;padding-right:16px;padding-bottom:36px;padding-left:16px;">
          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0b1220" style="width:100%;max-width:600px;background-color:#0b1220;border-top:1px solid #1f2937;border-right:1px solid #1f2937;border-bottom:1px solid #1f2937;border-left:1px solid #1f2937;border-radius:16px;">
            <tr>
              <td height="4" bgcolor="#2563eb" style="height:4px;font-size:0;line-height:0;background-color:#2563eb;border-top-left-radius:16px;border-top-right-radius:16px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding-top:26px;padding-right:28px;padding-bottom:0;padding-left:28px;">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="46" style="width:46px;vertical-align:middle;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="34" height="34" align="center" bgcolor="#2563eb" style="width:34px;height:34px;background-color:#2563eb;border-radius:9px;font-family:${EMAIL_FONT_STACK};font-size:17px;line-height:34px;font-weight:700;color:#ffffff;">H</td>
                        </tr>
                      </table>
                    </td>
                    <td style="vertical-align:middle;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="font-family:${EMAIL_FONT_STACK};font-size:16px;line-height:22px;font-weight:700;letter-spacing:-0.01em;color:#f8fafc;">HAFYN</td>
                        </tr>
                        <tr>
                          <td style="padding-top:2px;font-family:${EMAIL_FONT_STACK};font-size:11px;line-height:15px;font-weight:600;letter-spacing:0.08em;color:#64748b;">WEBSITE LEAD</td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td bgcolor="#0d2f22" style="background-color:#0d2f22;border-radius:999px;padding-top:5px;padding-right:11px;padding-bottom:5px;padding-left:11px;font-family:${EMAIL_FONT_STACK};font-size:10px;line-height:14px;font-weight:700;letter-spacing:0.08em;color:#34d399;">&#9679;&nbsp;LEAD</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${emailDivider()}
            <tr>
              <td style="padding-top:26px;padding-right:28px;padding-bottom:26px;padding-left:28px;">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:${EMAIL_FONT_STACK};font-size:11px;line-height:15px;font-weight:600;letter-spacing:0.16em;color:#64748b;">NEW WEBSITE LEAD</td>
                  </tr>
                  <tr>
                    <td style="padding-top:9px;font-family:${EMAIL_FONT_STACK};font-size:27px;line-height:33px;font-weight:700;letter-spacing:-0.02em;color:#ffffff;">${e(input.name)}</td>
                  </tr>
                  ${highValueBadge}
                </table>
              </td>
            </tr>
            ${emailDivider()}
            <tr>
              <td>
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                  ${fields}
                </table>
              </td>
            </tr>
            ${emailDivider()}
            <tr>
              <td style="padding-top:26px;padding-right:28px;padding-bottom:26px;padding-left:28px;">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:${EMAIL_FONT_STACK};font-size:10px;line-height:14px;letter-spacing:0.09em;font-weight:600;color:#64748b;">${emailIcon("doc")}&nbsp;MESSAGE</td>
                  </tr>
                  <tr>
                    <td style="padding-top:10px;">
                      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="4" bgcolor="#2563eb" style="width:4px;font-size:0;line-height:0;background-color:#2563eb;">&nbsp;</td>
                          <td bgcolor="#0f172a" style="background-color:#0f172a;padding-top:16px;padding-right:18px;padding-bottom:16px;padding-left:16px;font-family:${EMAIL_FONT_STACK};font-size:14px;line-height:22px;color:#cbd5e1;">${messageHtml}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${emailDivider()}
            <tr>
              <td style="padding-top:24px;padding-right:28px;padding-bottom:28px;padding-left:28px;">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${mailtoHref}" style="height:46px;v-text-anchor:middle;width:240px;" arcsize="10%" stroke="f" fillcolor="#2563eb">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:${EMAIL_FONT_STACK};font-size:14px;font-weight:700;">Reply to ${e(input.name)}&nbsp;&rarr;</center>
                      </v:roundrect>
                      <![endif]-->
                      <a href="${mailtoHref}" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-family:${EMAIL_FONT_STACK};font-size:14px;line-height:20px;font-weight:700;text-decoration:none;padding-top:13px;padding-right:28px;padding-bottom:13px;padding-left:28px;border-radius:8px;">Reply to ${e(input.name)}&nbsp;&rarr;</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${emailDivider()}
            <tr>
              <td style="padding-top:20px;padding-right:28px;padding-bottom:28px;padding-left:28px;">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family:${EMAIL_FONT_STACK};font-size:11px;line-height:16px;color:#64748b;">Submitted ${e(input.submittedAt)}</td>
                  </tr>
                  <tr>
                    <td style="padding-top:4px;font-family:${EMAIL_FONT_STACK};font-size:11px;line-height:16px;color:#475569;">Source: ${e(input.source)} &nbsp;&middot;&nbsp; HAFYN BUILDS &mdash; web &middot; software &middot; AI systems</td>
                  </tr>
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
