import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industries } from "@/data/industries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

interface IndustryPageProps {
  params: Promise<{ industry: string }>;
}

// dynamicParams = false enforces the PRD §2.2.6 empty-state rule at the
// routing layer: a slug that is not present in generateStaticParams() is
// served a 404 by Next *without* rendering this component. This is both
// more correct (an unknown industry truly "does not exist" rather than
// rendering-then-throwing) and avoids rendering a Server Component that
// throws notFound(), which React 19's dev-only performance profiler
// mis-times (a framework-internal dev bug, not an application defect).
export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((industry) => ({ industry: industry.id }));
}

export async function generateMetadata({
  params,
}: IndustryPageProps): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = industries.find((i) => i.id === slug);

  return buildMetadata({
    title: industry
      ? `${industry.name} — Packages & Pricing`
      : "Industry Not Found",
    description: industry
      ? `Premium ${industry.name.toLowerCase()} software packages from HAFYN BUILDS. Locally-calibrated pricing across 28 countries — hand-coded, never a template.`
      : undefined,
    path: `/investment/${slug}`,
  });
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { industry: slug } = await params;
  const industry = industries.find((i) => i.id === slug);

  // Defensive guard: with dynamicParams = false this branch is normally
  // unreachable (unknown slugs 404 at the router), but it keeps the page
  // correct if dynamicParams is ever re-enabled.
  if (!industry) notFound();

  // Phase 17 fix (I1): BreadcrumbList schema added.
  // Structure: Home > Investment > [Industry Name].
  // Signals page hierarchy to Google and triggers breadcrumb display
  // in search results for industry-specific package pages.
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home",       url: SITE_URL },
    { name: "Investment", url: `${SITE_URL}/investment` },
    { name: industry.name, url: `${SITE_URL}/investment/${industry.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main>
        <h1>{industry.name} — built in Phase 12</h1>
      </main>
    </>
  );
}