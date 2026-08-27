import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { LiveDeployPipeline } from "@/components/method/LiveDeployPipeline";
import { TimelineSection } from "@/components/method/TimelineSection";
import { CommunicationSection } from "@/components/method/CommunicationSection";
import { MethodBridgeCTA } from "@/components/method/MethodBridgeCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "How We Build Software & AI Products",
  description:
    "See the HAFYN BUILDS five-stage process for software and AI projects: discovery, design, build, launch, and support with transparent engineering decisions.",
  path: "/method",
});

/**
 * Method page — "Live Deploy" (PRD §2.2.5).
 * Static generation: content is fixed, no dynamic data.
 *
 * Page structure:
 *   1. LiveDeployPipeline  — GSAP-pinned 5-stage pipeline (the signature animation)
 *   2. TimelineSection     — Honest duration table by project size
 *   3. CommunicationSection — 4 communication promises
 *   4. MethodBridgeCTA     — Bridge → /investment
 */
const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Method", url: `${SITE_URL}/method` },
]);

export default function MethodPage() {
  return (
    <>
      <JsonLd id="method-breadcrumb-schema" data={breadcrumbJsonLd} />
      <main
      className="relative min-h-screen"
      style={{ backgroundColor: "rgb(10 10 11)" }}
    >
      {/* 1. Signature pipeline — takes up first viewport + scroll distance */}
      <LiveDeployPipeline />

      {/* Divider */}
      <div
        className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12"
        aria-hidden="true"
      >
        <div className="h-px w-full" style={{ backgroundColor: "rgb(42 42 49)" }} />
      </div>

      {/* 2. Timeline transparency */}
      <TimelineSection />

      {/* Divider */}
      <div
        className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12"
        aria-hidden="true"
      >
        <div className="h-px w-full" style={{ backgroundColor: "rgb(42 42 49)" }} />
      </div>

      {/* 3. Communication promise */}
      <CommunicationSection />

      {/* Divider */}
      <div
        className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12"
        aria-hidden="true"
      >
        <div className="h-px w-full" style={{ backgroundColor: "rgb(42 42 49)" }} />
      </div>

      {/* 4. Bridge CTA */}
      <MethodBridgeCTA />
      </main>
    </>
  );
}
