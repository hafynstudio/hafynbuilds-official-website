import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industries } from "@/data/industries";
import { buildMetadata } from "@/lib/seo/metadata";

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
// Once Phase 11 populates `industries`, real slugs render normally and
// unknown slugs still 404 cleanly here.
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
    title: industry?.name ?? "Industry Not Found",
    path: `/investment/${slug}`,
  });
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { industry: slug } = await params;
  const industry = industries.find((i) => i.id === slug);

  // Defensive guard: with dynamicParams = false this branch is normally
  // unreachable (unknown slugs 404 at the router), but it keeps the page
  // correct if dynamicParams is ever re-enabled.
  if (!industry) {
    notFound();
  }

  return (
    <main>
      <h1>{industry.name} — built in Phase 12</h1>
    </main>
  );
}
