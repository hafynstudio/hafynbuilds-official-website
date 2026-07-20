import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/home/Hero";

// Title passed WITHOUT the brand name so buildMetadata's normal suffix
// path applies, producing "Engineering the Impossible. Building What
// Matters. | HAFYN BUILDS" — the motto leads, the brand name closes the
// title tag. (buildMetadata has a special-case that leaves the title
// bare/unsuffixed only when it's passed as exactly "HAFYN BUILDS" —
// intentionally not used here since the homepage title tag should carry
// the motto for SEO/brand purposes.)
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
      {/* Remaining Home sections — Trust Bar, Capabilities Teaser, Method
          Teaser, Featured Work, Founder Teaser, Values, Final CTA — are
          built in Phase 5, per TAD §13's build order (Hero establishes
          the motion language first; every later section reuses it). */}
    </>
  );
}
