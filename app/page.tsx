import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { CapabilitiesTeaser } from "@/components/home/CapabilitiesTeaser";
import { MethodTeaser } from "@/components/home/MethodTeaser";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { FounderTeaser } from "@/components/home/FounderTeaser";
import { ValuesSection } from "@/components/home/ValuesSection";
import { FinalCTA } from "@/components/home/FinalCTA";

// Title passed WITHOUT the brand name so buildMetadata applies its normal
// suffix, producing:
// "Engineering the Impossible. Building What Matters. | HAFYN BUILDS"
// The motto leads; the brand name closes — correct for homepage SEO.
export const metadata: Metadata = buildMetadata({
  title: "Engineering the Impossible. Building What Matters.",
  description:
    "HAFYN BUILDS is the flagship software engineering & AI company of the HAFYN technology holding group, founded by Zain Marwat. Web apps, software, AI systems, automation, and enterprise solutions.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CapabilitiesTeaser />
      <MethodTeaser />
      <FeaturedWork />
      <FounderTeaser />
      <ValuesSection />
      <FinalCTA />
    </>
  );
}
