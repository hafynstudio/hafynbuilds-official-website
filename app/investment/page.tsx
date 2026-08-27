import { buildMetadata } from "@/lib/seo/metadata";
import { InvestmentExperience } from "@/components/investment/InvestmentExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Custom Website Packages, Plans & Pricing",
  description:
    "Compare HAFYN BUILDS website packages and pricing across 28 countries. Choose a hand-coded foundation for your business or an industry-specific build.",
  path: "/investment",
});

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Investment", url: `${SITE_URL}/investment` },
]);

export default function InvestmentPage() {
  return (
    <>
      <JsonLd id="investment-breadcrumb-schema" data={breadcrumbJsonLd} />
      <InvestmentExperience />
    </>
  );
}
