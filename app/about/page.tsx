import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { buildMetadata } from "@/lib/seo/metadata";
import { AboutHero } from "@/components/about/AboutHero";

// Below-fold sections deferred via next/dynamic (BUG-025).
// AboutHero is above the fold and loads synchronously — it is the LCP section.
// All sections below it use whileInView / useInView — their Framer Motion
// instances only activate on scroll, so deferring them does not affect any
// visible first-paint behavior. Deferring reduces initial hydration cost and
// pushes the RevealSection chunk (02t-lq31jy4so.js, 35.7 KiB) out of the
// LCP critical path.
const OriginStory = dynamic(() =>
  import("@/components/about/OriginStory").then((m) => ({ default: m.OriginStory }))
);
const MissionVision = dynamic(() =>
  import("@/components/about/MissionVision").then((m) => ({ default: m.MissionVision }))
);
const EcosystemDiagram = dynamic(() =>
  import("@/components/about/EcosystemDiagram").then((m) => ({ default: m.EcosystemDiagram }))
);
const ValuesCards = dynamic(() =>
  import("@/components/about/ValuesCards").then((m) => ({ default: m.ValuesCards }))
);
const Standards = dynamic(() =>
  import("@/components/about/Standards").then((m) => ({ default: m.Standards }))
);
const FounderBridge = dynamic(() =>
  import("@/components/about/FounderBridge").then((m) => ({ default: m.FounderBridge }))
);

// Previously used a raw hardcoded metadata object — missing canonical URL,
// OG images, Twitter Card, metadataBase, and robots directive. Replaced
// with buildMetadata() (Phase 17 audit fix C4) so this page has correct
// structured metadata identical to all other pages in the system.
export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "HAFYN BUILDS is a premium software engineering and AI company founded by Zain Marwat. Learn our origin story, mission, values, and the HAFYN ecosystem vision.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OriginStory />
      <MissionVision />
      <EcosystemDiagram />
      <ValuesCards />
      <Standards />
      <FounderBridge />
    </main>
  );
}