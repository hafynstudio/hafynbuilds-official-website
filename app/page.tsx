import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { DeferredHomeSections } from "@/components/home/DeferredHomeSections";

// Title passed WITHOUT the brand name so buildMetadata applies its normal
// suffix, producing:
// "Engineering the Impossible. Building What Matters. | HAFYN BUILDS"
// The motto leads; the brand name closes — correct for homepage SEO.
export const metadata: Metadata = buildMetadata({
  title: "Software Engineering, AI & Digital Products",
  description:
    "HAFYN BUILDS engineers web apps, AI systems, and automation for companies. Explore digital products and enterprise software built to last, from idea to launch.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <DeferredHomeSections />
    </>
  );
}
