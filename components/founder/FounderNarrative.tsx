import { founder } from "@/data/founder";
import { RevealSection } from "@/components/ui/RevealSection";
import type { FounderNarrativeBlock } from "@/types/founder";

type ProseBlockType = Extract<FounderNarrativeBlock, { type: "prose" }>;
type QuoteBlockType = Extract<FounderNarrativeBlock, { type: "quote" }>;

/**
 * Standard prose section: heading + paragraph(s). Rendered inside a
 * readable-measure column consistent with the "calmer motion, focus over
 * animation" content-page principle (PRD Section 3.2).
 */
function ProseBlock({ block }: { block: ProseBlockType }) {
  return (
    <RevealSection
      as="div"
      className="mx-auto max-w-[680px] py-10 lg:py-14"
    >
      <h2 className="mb-5 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {block.heading}
      </h2>
      <div className="space-y-5">
        {block.paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </RevealSection>
  );
}

/**
 * Pull-quote section. No serif typeface exists in the brand system
 * (Decision D28) -- quotes are distinguished by scale, weight, a left
 * accent bar, and a small bracket glyph rather than an italic font
 * swap, keeping the engineering-native visual language intact.
 */
function QuoteBlock({ block }: { block: QuoteBlockType }) {
  return (
    <RevealSection
      as="div"
      className="mx-auto max-w-[820px] py-14 lg:py-20"
    >
      <div className="relative border-l-2 border-accent pl-6 sm:pl-8">
        <span
          aria-hidden="true"
          className="absolute -left-[13px] -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-bg-primary text-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path d="M7 7h4v4a4 4 0 0 1-4 4H6v-2h1a2 2 0 0 0 2-2H7V7zm8 0h4v4a4 4 0 0 1-4 4h-1v-2h1a2 2 0 0 0 2-2h-2V7z" />
          </svg>
        </span>
        <p className="text-2xl font-semibold leading-snug tracking-tight text-text-primary sm:text-3xl">
          {block.quote}
        </p>
        {block.context && (
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-text-tertiary">
            {block.context}
          </p>
        )}
      </div>
    </RevealSection>
  );
}

/**
 * Renders the founder's ordered narrative (data/founder.ts). Order,
 * insertion, and removal of any prose/quote block is entirely
 * data-driven -- this component never encodes the reading order itself
 * (Decision D25), keeping the page admin-panel-ready.
 */
export function FounderNarrative() {
  return (
    <section className="relative bg-bg-primary px-6 lg:px-12">
      {founder.narrative.map((block) =>
        block.type === "prose" ? (
          <ProseBlock key={block.id} block={block} />
        ) : (
          <QuoteBlock key={block.id} block={block} />
        )
      )}
    </section>
  );
}
