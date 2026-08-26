import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industries } from "@/data/industries";
import { getPackagesForIndustry } from "@/data/industry-packages";
import { getVisibleIndustries } from "@/lib/industries/provider";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";
import { IndustryPageExperience } from "@/components/investment/IndustryPageExperience";

interface IndustryPageProps {
  params: Promise<{ industry: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getVisibleIndustries().map((industry) => ({ industry: industry.id }));
}

export async function generateMetadata({
  params,
}: IndustryPageProps): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = industries.find((item) => item.id === slug);

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
  const industry = getVisibleIndustries().find((item) => item.id === slug);

  if (!industry) notFound();

  const packages = getPackagesForIndustry(industry.id);
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Investment", url: `${SITE_URL}/investment` },
    { name: industry.name, url: `${SITE_URL}/investment/${industry.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <IndustryPageExperience industry={industry} packages={packages} />
    </>
  );
}
