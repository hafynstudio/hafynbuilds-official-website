import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { founder } from "@/data/founder";
import { RevealSection } from "@/components/ui/RevealSection";
import { ICON_STROKE_WIDTH } from "@/lib/icons";

/**
 * "Looking Ahead" -- a brief callback to the HAFYN ecosystem vision (PRD
 * Section 2.2.7). Deliberately lighter than About's full EcosystemDiagram
 * (Phase 6) -- this is a callback, not a duplicate. Links through to
 * /about for the complete animated org-chart experience.
 */
export function EcosystemCallout() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-bg-secondary px-6 py-20 lg:px-12 lg:py-28">
      {/* Ghosted node motif -- a light nod to the ecosystem diagram,
          not a rebuild of it. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
      >
        <svg
          viewBox="0 0 400 200"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="200" cy="40" r="5" fill="rgb(62 123 250)" />
          <circle cx="120" cy="120" r="4" fill="rgb(250 250 250)" />
          <circle cx="280" cy="120" r="4" fill="rgb(250 250 250)" />
          <circle cx="80" cy="180" r="3" fill="rgb(250 250 250)" />
          <circle cx="200" cy="180" r="3" fill="rgb(250 250 250)" />
          <circle cx="320" cy="180" r="3" fill="rgb(250 250 250)" />
          <line x1="200" y1="40" x2="120" y2="120" stroke="rgb(250 250 250)" strokeWidth="1" />
          <line x1="200" y1="40" x2="280" y2="120" stroke="rgb(250 250 250)" strokeWidth="1" />
          <line x1="120" y1="120" x2="80" y2="180" stroke="rgb(250 250 250)" strokeWidth="1" />
          <line x1="120" y1="120" x2="200" y2="180" stroke="rgb(250 250 250)" strokeWidth="1" />
          <line x1="280" y1="120" x2="320" y2="180" stroke="rgb(250 250 250)" strokeWidth="1" />
        </svg>
      </div>

      <RevealSection
        as="div"
        className="relative mx-auto max-w-[720px] text-center"
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.17em] text-accent">
          The Long Game
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {founder.ecosystemVision.heading}
        </h2>
        <div className="mt-6 space-y-4">
          {founder.ecosystemVision.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <Link
          href="/about"
          className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-200 hover:text-accent-hover"
        >
          Explore the HAFYN ecosystem
          <ArrowRight
            size={14}
            strokeWidth={ICON_STROKE_WIDTH}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </RevealSection>
    </section>
  );
}
