import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import dynamic from "next/dynamic";

// BUG-007: Below-fold sections are dynamically imported. They share Framer
// Motion entrance animations that cause CLS when hydrated via next/dynamic
// with ssr:true — fixed by:
//   1. Setting initial={false} on RevealSection (BUG-007 CORRECTIVE PASS 2),
//      which prevents Framer Motion from flashing SSR-applied "hidden"
//      variant styles during hydration — element stays at its SSR state.
//   2. Loading placeholders with height reservation on every dynamic import
//      so page layout never collapses while chunks load.
const CapabilitiesTeaser = dynamic(
  () =>
    import("@/components/home/CapabilitiesTeaser").then(
      (m) => ({ default: m.CapabilitiesTeaser })
    ),
  {
    loading: () => (
      <div aria-hidden="true" style={{ minHeight: "1100px", width: "100%" }} />
    ),
  }
);
const MethodTeaser = dynamic(
  () =>
    import("@/components/home/MethodTeaser").then(
      (m) => ({ default: m.MethodTeaser })
    ),
  {
    loading: () => (
      <div aria-hidden="true" style={{ minHeight: "800px", width: "100%" }} />
    ),
  }
);
const FeaturedWork = dynamic(
  () =>
    import("@/components/home/FeaturedWork").then(
      (m) => ({ default: m.FeaturedWork })
    ),
  {
    loading: () => (
      <div aria-hidden="true" style={{ minHeight: "1500px", width: "100%" }} />
    ),
  }
);
const FounderTeaser = dynamic(
  () =>
    import("@/components/home/FounderTeaser").then(
      (m) => ({ default: m.FounderTeaser })
    ),
  {
    loading: () => (
      <div aria-hidden="true" style={{ minHeight: "700px", width: "100%" }} />
    ),
  }
);
const ValuesSection = dynamic(
  () =>
    import("@/components/home/ValuesSection").then(
      (m) => ({ default: m.ValuesSection })
    ),
  {
    loading: () => (
      <div aria-hidden="true" style={{ minHeight: "1200px", width: "100%" }} />
    ),
  }
);
const FinalCTA = dynamic(
  () =>
    import("@/components/home/FinalCTA").then(
      (m) => ({ default: m.FinalCTA })
    ),
  {
    loading: () => (
      <div aria-hidden="true" style={{ minHeight: "700px", width: "100%" }} />
    ),
  }
);

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
