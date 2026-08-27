import { buildMetadata } from "@/lib/seo/metadata";
import { InvestmentExperience } from "@/components/investment/InvestmentExperience";

export const metadata = buildMetadata({
  title: "Custom Website Packages, Plans & Pricing",
  description:
    "Compare HAFYN BUILDS website packages and pricing across 28 countries. Choose a hand-coded foundation for your business or an industry-specific build.",
  path: "/investment",
});

export default function InvestmentPage() {
  return <InvestmentExperience />;
}
