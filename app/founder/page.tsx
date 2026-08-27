import { buildMetadata } from "@/lib/seo/metadata";
import { personSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";
import { FounderHero } from "@/components/founder/FounderHero";
import { FounderNarrative } from "@/components/founder/FounderNarrative";
import { EcosystemCallout } from "@/components/founder/EcosystemCallout";
import { ClosingStatement } from "@/components/founder/ClosingStatement";
import { FounderSocials } from "@/components/founder/FounderSocials";

// Phase 17 fix (C7): title changed from "Founder" to the full name + title
// so the browser tab, Google search result, and social share card all read
// "Zain Marwat — Founder, Director & CEO | HAFYN BUILDS" rather than the
// generic "Founder | HAFYN BUILDS". This directly supports the SEO goal of
// Google correctly attributing "Zain Marwat = Founder of HAFYN BUILDS"
// (PRD Section 4) — the page title is one of the strongest on-page signals
// Google uses for Person entity recognition.
export const metadata = buildMetadata({
  title: "Zain Marwat — Founder, Director & CEO",
  description:
    "Meet Zain Marwat, Founder, Director & CEO of HAFYN BUILDS. His engineering-led approach turns ambitious ideas into software and AI systems that last today.",
  path: "/founder",
});

/**
 * Founder page (Phase 13). Server component -- statically generable
 * (SSG), since no direct child requires page-level client state; each
 * interactive component (FounderHero's scroll parallax, FounderNarrative's
 * reveal animations, etc.) manages its own "use client" boundary
 * internally. This matters directly for the SEO/crawlability requirement
 * (TAD Section 6.4) and for Core Web Vitals.
 *
 * Person schema (business-critical, PRD Section 4 + TAD Section 11) is
 * injected here via a JSON-LD script tag -- this is what allows Google
 * and AI systems to correctly attribute "Zain Marwat = Founder of HAFYN
 * BUILDS" when asked. Do not remove or relocate this without an
 * equivalent replacement.
 *
 * Heading hierarchy: FounderHero owns the page's single h1 (founder
 * name). FounderNarrative / EcosystemCallout / FounderSocials each use
 * h2. ClosingStatement is a pull-quote paragraph, correctly not a
 * heading level -- no skipped levels anywhere on this page.
 */
export default function FounderPage() {
  const schema = personSchema();
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Founder", url: `${SITE_URL}/founder` },
  ]);

  return (
    <>
      <JsonLd id="founder-person-schema" data={schema} />
      <JsonLd id="founder-breadcrumb-schema" data={breadcrumbJsonLd} />
      <div>
        <FounderHero />
        <FounderNarrative />
        <EcosystemCallout />
        <ClosingStatement />
        <FounderSocials />
      </div>
    </>
  );
}