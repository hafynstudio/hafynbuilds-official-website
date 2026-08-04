import { founder } from "@/data/founder";
import { RevealSection } from "@/components/ui/RevealSection";
import { Signature } from "@/components/ui/Signature";

/**
 * Final signature statement -- the page's payoff moment. Pairs the
 * closing quote with the real signature.png at full visual weight
 * (larger than either FounderTeaser usage), since this is the last
 * thing a visitor reads before leaving the page.
 */
export function ClosingStatement() {
  return (
    <section className="relative overflow-hidden bg-bg-primary px-6 py-24 lg:px-12 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgb(62 123 250 / 0.06) 0%, transparent 70%)",
        }}
      />
      <RevealSection
        as="div"
        className="relative mx-auto max-w-[820px] text-center"
      >
        <p className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          &ldquo;{founder.closingQuote.quote}&rdquo;
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Signature heightPx={80} />
          {founder.closingQuote.context && (
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-text-tertiary">
              {founder.closingQuote.context}
            </span>
          )}
        </div>
      </RevealSection>
    </section>
  );
}
