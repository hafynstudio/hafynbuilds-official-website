import { buildMetadata } from "@/lib/seo/metadata";
import { InvestmentExperience } from "@/components/investment/InvestmentExperience";

export const metadata = buildMetadata({
  title: "Investment",
  description:
    "Locally-calibrated pricing across 28 countries. Every website hand-coded — never a template. Choose your package or explore industry-specific solutions.",
  path: "/investment",
});

export default function InvestmentPage() {
  return <InvestmentExperience />;
}
