import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { WhatsAppCTA } from "@/components/contact/WhatsAppCTA";
import { SocialGrid } from "@/components/contact/SocialGrid";
import { ContactHero } from "@/components/contact/ContactHero";
import { CopyEmailHandler } from "@/components/contact/CopyEmailHandler";
import { DeferredContactForm } from "@/components/contact/DeferredContactForm";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

// ---------------------------------------------------------------------------
// Real contact channels — single source of truth for the Contact page.
// Any change to the primary email or the response window happens here
// and threads through every child component via props (no duplication).
// ---------------------------------------------------------------------------
const CONTACT_EMAIL = "hafynbuilds@gmail.com";
// FIX (Phase 2, TRUST-007): "within 30 minutes" was a specific response
// SLA the operation cannot prove. Minimum safe correction: an honest,
// non-committal reply commitment. The business owner must supply the
// authoritative SLA if a specific window should ever be advertised again.
const REPLY_WINDOW = "promptly";

// Optional pre-filled WhatsApp message. Keeps user out of the "what do I
// even type first?" moment on mobile — signals we already know they came
// from the site. Kept short so it doesn't feel spammy or presumptuous.
const WHATSAPP_PREFILL =
  "Hi HAFYN BUILDS — reaching out via hafynbuilds.vercel.app. I'd like to discuss a project.";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = buildMetadata({
  title: "Start a Software Project with HAFYN",
  description:
    "Tell HAFYN BUILDS what you need: a website, web app, software platform, AI system, or automation project. Start a build conversation today with our team.",
  path: "/contact",
});

// ---------------------------------------------------------------------------
// JSON-LD schemas
//
// Phase 17 fix (C8): removed the duplicate organizationSchema() injection
// that was previously here. app/layout.tsx already injects Organization
// schema sitewide — having a second copy on this page caused Google's
// Rich Results Test to flag a duplicate structured data error.
// BreadcrumbList schema is kept — it is page-specific and correct here.
// ---------------------------------------------------------------------------

const breadcrumb = breadcrumbSchema([
  { name: "Home",    url: SITE_URL },
  { name: "Contact", url: `${SITE_URL}/contact` },
]);

// ---------------------------------------------------------------------------
// Page
//
// Layout strategy:
//   Desktop (>= lg): two columns, form on left, contact rail on right.
//   Mobile  (< lg):  single column, WhatsApp CTA pinned ABOVE the form
//     (highest-conversion element within thumb-reach on first paint),
//     then form, then remaining contact channels.
//   This ordering is done in the DOM here — no JS branching — so it's
//   SSR-correct and free of hydration mismatches.
// ---------------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <JsonLd id="contact-breadcrumb-schema" data={breadcrumb} />

      <CopyEmailHandler />

      <main className="min-h-screen bg-bg-primary">
        <ContactHero replyWindow={REPLY_WINDOW} />

        <section className="mx-auto max-w-7xl px-5 pb-14 pt-6 sm:px-6 sm:py-20 md:px-12 lg:px-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_460px] lg:gap-14">

            {/* --------------------------------------------------------
                MOBILE-ONLY: WhatsApp hero placement above the form.
                Highest-conversion element in first thumb-reach zone.
            -------------------------------------------------------- */}
            <div className="lg:hidden">
              <WhatsAppCTA
                variant="hero"
                subtext="Fastest path to a reply. Founder answers personally."
                prefillMessage={WHATSAPP_PREFILL}
              />
              <p className="mt-3 text-center text-xs text-text-tertiary">
                or fill the form below
              </p>
            </div>

            {/* --------------------------------------------------------
                Left column — Form
            -------------------------------------------------------- */}
            <div>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-2xl font-semibold text-text-primary sm:text-2xl">
                  Build Request
                </h2>
                <span className="text-xs uppercase tracking-widest text-text-secondary">
                  ~2 min
                </span>
              </div>
              <DeferredContactForm replyWindow={REPLY_WINDOW} />
            </div>

            {/* --------------------------------------------------------
                Right column — Contact details
                Order on mobile (below form): Email → Socials → Response promise
                Order on desktop:            WhatsApp → Email → Socials → Response promise
            -------------------------------------------------------- */}
            <aside className="space-y-10 lg:space-y-12">

              {/* DESKTOP-ONLY: WhatsApp CTA in card variant */}
              <div className="hidden lg:block">
                <h2 className="mb-6 text-2xl font-semibold text-text-primary">
                  Prefer to message directly?
                </h2>
                <WhatsAppCTA variant="card" prefillMessage={WHATSAPP_PREFILL} />
              </div>

              <DirectEmail email={CONTACT_EMAIL} />

              <div>
                <h3 className="mb-4 text-lg font-medium text-text-primary">
                  Find us on
                </h3>
                <SocialGrid />
              </div>

              <ResponsePromise replyWindow={REPLY_WINDOW} />
            </aside>

          </div>
        </section>
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// DirectEmail — server component. Interactive copy handled by
// CopyEmailHandler via event delegation on data-copy-email attribute.
// Mobile: entire row is tappable via label wrapping. Desktop: keeps
// separate Copy button for clarity.
// ---------------------------------------------------------------------------

function DirectEmail({ email }: { email: string }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-medium text-text-primary">
        Email us directly
      </h3>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${email}`}
          className="font-mono text-base text-accent transition-colors hover:text-accent-hover sm:text-base"
        >
          {email}
        </a>
        <button
          type="button"
          aria-label="Copy email address"
          data-copy-email={email}
          className="rounded-md border border-border bg-surface/50 px-3 py-1.5 text-xs text-text-secondary transition-all hover:border-border-hover hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        >
          Copy
        </button>
      </div>
      <span
        id="copy-confirm"
        aria-live="polite"
        className="mt-2 block text-xs text-success opacity-0 transition-opacity duration-base"
      >
        Copied to clipboard ✓
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResponsePromise — the reassurance card at the bottom of the contact rail.
// Kept as its own component so the page-level component stays readable.
// ---------------------------------------------------------------------------

function ResponsePromise({ replyWindow }: { replyWindow: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/30 px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <p className="text-sm font-medium text-text-primary">
          We reply {replyWindow}
        </p>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
        Every build request is read personally by our team.
        No auto-responses, no ticket queues.
      </p>
    </div>
  );
}