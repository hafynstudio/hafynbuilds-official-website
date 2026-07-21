import { RevealSection, RevealItem } from "@/components/ui/RevealSection";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { featuredWork } from "@/data/featured-work";

/**
 * Home's "What We Build" showcase (PRD §2.2.1). HAFYN BUILDS is a
 * newly-launched brand with no external client case studies yet — per
 * PRD's explicit ban on fake testimonials and placeholder client work,
 * this shows real, verifiable internal builds tagged "Internal Build"
 * so visitors can never mistake them for client projects. Real client
 * case studies drop into the same data/featured-work.ts array the
 * moment they exist — this component requires zero changes.
 *
 * TiltCard wraps each entry for cursor-reactive 3D depth (PRD §2.2.1:
 * "cursor-reactive tilt on project cards"). TiltCard self-gates to
 * fine-pointer + motion-safe devices — no guard needed here.
 */
export function FeaturedWork() {
  if (featuredWork.length === 0) return null;

  const sorted = [...featuredWork].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <RevealSection className="mb-12 max-w-2xl">
        <p className="mb-3 font-mono text-sm text-accent">Proof of Work</p>
        <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
          Proof, not promises.
        </h2>
        <p className="mt-4 text-base text-text-secondary">
          Real, shipped work — including the systems running this website right now.
        </p>
      </RevealSection>

      <RevealSection
        stagger={0.1}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {sorted.map((work) => (
          <RevealItem key={work.id}>
            <TiltCard className="h-full">
              <Card className="flex h-full flex-col p-6">
                <span className="mb-4 inline-block self-start rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                  {work.tag}
                </span>
                <h3 className="text-xl font-semibold text-text-primary">
                  {work.name}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {work.description}
                </p>
                {work.href && (
                  <a
                    href={work.href}
                    className="mt-4 self-start text-sm font-medium text-accent transition-colors duration-base hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View →
                  </a>
                )}
              </Card>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealSection>
    </section>
  );
}
