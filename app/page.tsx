import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { DeferredHomeSections } from "@/components/home/DeferredHomeSections";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteSchema } from "@/lib/seo/schema";

// The homepage title is intentionally brand-first and fully qualified.
export const metadata: Metadata = buildMetadata({
  title: "HAFYN BUILDS | Software, AI & Enterprise Systems",
  description:
    "HAFYN BUILDS is a software engineering and AI company building custom SaaS platforms, AI-powered products, and scalable digital infrastructure.",
  path: "/",
});

const websiteJsonLd = websiteSchema();

export default function HomePage() {
  return (
    <>
      <JsonLd id="website-schema" data={websiteJsonLd} />
      <Hero />
      <TrustBar />
      <DeferredHomeSections />
    </>
  );
}
