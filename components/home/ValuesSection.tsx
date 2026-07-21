import { RevealSection, RevealItem } from "@/components/ui/RevealSection";
import { Card } from "@/components/ui/Card";
import { companyValues } from "@/data/values";

/**
 * Home's condensed "How We Operate" values grid (PRD §2.2.1). Shows
 * only name + oneLiner — About page (Phase 6) uses the same
 * data/values.ts source for its hover-expand treatment, adding
 * expandedDescription per value at that point. One data source, two
 * presentations, zero drift risk between pages.
 *
 * Server component — no interactivity needed here. The hover-expand
 * behaviour lives in Phase 6's About-specific ValuesCards component.
 */
export function ValuesSection() {
  if (companyValues.length === 0) return null;

  const sorted = [...companyValues].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <RevealSection className="mb-12 max-w-2xl">
        <p className="mb-3 font-mono text-sm text-accent">How We Operate</p>
        <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
          Six values. Zero exceptions.
        </h2>
      </RevealSection>

      <RevealSection
        stagger={0.08}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {sorted.map((value) => (
          <RevealItem key={value.id}>
            <Card className="flex h-full flex-col p-6">
              <h3 className="text-lg font-semibold text-text-primary">
                {value.name}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {value.oneLiner}
              </p>
            </Card>
          </RevealItem>
        ))}
      </RevealSection>
    </section>
  );
}
