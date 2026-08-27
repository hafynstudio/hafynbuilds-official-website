import { buildMetadata } from "@/lib/seo/metadata";
import { CapabilitiesHero } from "@/components/capabilities/CapabilitiesHero";
import { DynamicBuildConsole } from "@/components/capabilities/DynamicBuildConsole";
import { TechPhilosophyStrip } from "@/components/capabilities/TechPhilosophyStrip";
import { IndustriesMarquee } from "@/components/capabilities/IndustriesMarquee";
import { CapabilitiesFinalCTA } from "@/components/capabilities/CapabilitiesFinalCTA";
import { capabilities } from "@/data/capabilities";

// Phase 17 fix (C6): added page-specific description. Previously falling
// back to the generic site description with no differentiation signal
// for this page. Description now reflects actual page content so Google
// can generate a relevant search snippet.
export const metadata = buildMetadata({
  title: "Web Apps, AI & Software Engineering Services",
  description:
    "Explore HAFYN BUILDS capabilities across web apps, SaaS, AI systems, automation, and enterprise software—digital products engineered to last for serious teams.",
  path: "/capabilities",
});

export default function CapabilitiesPage() {
  return (
    <main>
      <CapabilitiesHero />
      <section aria-labelledby="build-console-heading">
        <h2 id="build-console-heading" className="sr-only">
          The Build Console — Five Compile Sequences
        </h2>
        <DynamicBuildConsole panelCount={capabilities.length} />
      </section>
      <TechPhilosophyStrip />
      <IndustriesMarquee />
      <CapabilitiesFinalCTA />
    </main>
  );
}