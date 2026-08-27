import { buildMetadata } from "@/lib/seo/metadata";
import { FounderSpotlight } from "@/components/team/FounderSpotlight";
import { TeamGrid } from "@/components/team/TeamGrid";

// BUG-028 note: TeamGrid was briefly converted to next/dynamic under
// the hypothesis that its below-fold Framer Motion instance was
// contributing to TBT (same pattern as BUG-025's About sections).
// Lighthouse evidence disproved this: data/team.ts currently returns
// [], so TeamGrid renders only its lightweight EmptyState branch —
// the per-member motion.div loop this pattern targets never executes
// in the current build. Code-splitting introduced webpack chunk-
// loading overhead (confirmed via two new scored long tasks,
// 1v1rj1gvavt3b.js and 2iho8jepmwwua.js) that cost more main-thread
// time than the deferral saved — mobile TBT regressed 520ms to 570ms.
// Reverted to a static import. Revisit next/dynamic for this
// component only if data/team.ts is populated with real members in
// the future, at which point the populated-grid branch's motion cost
// may justify the split again.

// Phase 17 fix (C5): added page-specific description. Previously falling
// back to the generic site description, which gives Google no
// differentiating signal for this page vs. any other page on the site.
export const metadata = buildMetadata({
  title: "HAFYN Builders & Engineering Team Studio",
  description:
    "Meet the HAFYN BUILDS team: engineers, designers, and product thinkers led by Zain Marwat, building dependable software and AI systems for ambitious teams.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <main>
      <FounderSpotlight />
      <TeamGrid />
    </main>
  );
}