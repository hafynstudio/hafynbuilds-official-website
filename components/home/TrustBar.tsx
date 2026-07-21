"use client";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { LiveDot } from "@/components/home/LiveDot";

interface TrustStatement {
  text: string;
  /** "live" gives this entry a distinct [LIVE] marker instead of the
   * standard [✓] — a deliberate structural break signaling editorial
   * hierarchy rather than a uniform mechanical loop. */
  marker?: "live";
}

// Qualitative category-strength statements (PRD §2.2.1: "category
// strengths, not fake client logos") — user-approved list. Deliberately
// does NOT repeat HeroVisual's stat row; numeric SLA-style claims are
// excluded until a real, verifiable commitment backs them.
const TRUST_STATEMENTS: TrustStatement[] = [
  { text: "100+ industries served", marker: "live" },
  { text: "TypeScript-first engineering" },
  { text: "Security-by-design, not bolted on" },
  { text: "Built for scale from day one" },
  { text: "Direct founder-level involvement on every build" },
];

// Deterministic (NOT Math.random() — see KineticHeadline.tsx's identical
// SSR-hydration-safety precedent) cycle of token-backed spacing utilities
// (mr-4/mr-6/mr-8 map to --space-4/6/8) applied per item index. Breaks
// the perfectly uniform mechanical rhythm of a plain repeated loop into
// something that reads as an organic log, while every value still comes
// from the existing spacing token scale — no raw/arbitrary pixel magic
// numbers introduced.
const GAP_CLASS_CYCLE = ["mr-4", "mr-6", "mr-8", "mr-4", "mr-6"] as const;

/**
 * A single log entry — `[✓] statement` or `[LIVE] statement`, monospace,
 * no border/background/icon. This is a log line, not a badge. Default
 * marker uses text-accent (brand blue) rather than the semantic success
 * green — --color-success is reserved exclusively for Hero's "Deployed"
 * state per its original scoped purpose. The "live" marker variant uses
 * accent-glow (cyan) + the shared LiveDot component, both visually
 * distinct from the default marker and directly reusing an existing
 * brand element rather than inventing a new one.
 */
function LogEntry({
  text,
  marker,
  gapClassName,
}: {
  text: string;
  marker?: "live";
  gapClassName: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-sm",
        gapClassName
      )}
    >
      {marker === "live" ? (
        <span
          className="flex items-center gap-1.5 font-semibold text-accent-glow"
          aria-hidden="true"
        >
          <LiveDot />
          [LIVE]
        </span>
      ) : (
        <span className="text-accent" aria-hidden="true">
          [✓]
        </span>
      )}
      <span className="text-text-secondary">{text}</span>
      <span className="ml-5 text-text-tertiary" aria-hidden="true">
        ·
      </span>
    </span>
  );
}

/**
 * Fixed, non-scrolling left-edge label mirroring HeroVisual's own
 * terminal header row — ties this strip directly back to Hero's
 * terminal identity. Bumped to text-sm/text-secondary (path) and
 * text-xs (live badge) — one step up from Hero's own text-xs/text-[10px]
 * — so this strip's header reads with slightly more presence rather
 * than as an afterthought relative to how prominent Hero's own header
 * is inside its terminal card.
 */
function StatusLogLabel() {
  return (
    <div className="mr-5 flex shrink-0 items-center gap-3 border-r border-border pr-5">
      <span className="hidden font-mono text-sm text-text-secondary sm:inline">
        ~/hafyn-builds/status.log
      </span>
      <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-accent">
        <LiveDot />
        live
      </span>
    </div>
  );
}

/**
 * "Engineering Status Log" — Home's credibility strip (PRD §2.2.1),
 * styled as a scrolling terminal log-line extending Hero's own
 * deploy.ts terminal-card motif, rather than a generic pill/badge
 * marquee. Visual identity is deliberately flatter/more functional than
 * Hero (bg-surface/30, hairline borders, a faint CRT-style scanline
 * texture at ~3% opacity) — a real terminal doesn't have soft gaussian
 * glows, and this creates a clear rhythm: Hero = the premium hero
 * moment, this strip = a quieter, functional system-status beat before
 * the next full section.
 *
 * Motion: pure CSS transform marquee (GPU-only), two duplicated copies
 * for a seamless -50% translateX loop, mask-image edge fade (widened to
 * a 12%/88% transparent zone so text is fully invisible before being
 * clipped, never visibly cropped mid-word), pause on hover/focus-within
 * (WCAG 2.1 §2.2.2), full static fallback for reduced-motion.
 */
export function TrustBar() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const scanlines = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgb(255 255 255) 0px, rgb(255 255 255) 1px, transparent 1px, transparent 3px)",
      }}
    />
  );

  if (prefersReducedMotion) {
    return (
      <section
        aria-label="Why HAFYN BUILDS"
        className="relative isolate overflow-hidden border-y border-border bg-surface/30 py-6"
      >
        {scanlines}
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-3 px-6">
          <StatusLogLabel />
          {TRUST_STATEMENTS.map((stat, i) => (
            <LogEntry
              key={stat.text}
              text={stat.text}
              marker={stat.marker}
              gapClassName={GAP_CLASS_CYCLE[i % GAP_CLASS_CYCLE.length]}
            />
          ))}
        </div>
      </section>
    );
  }

  // Widened from the previous 6%/94% pass — text is now fully
  // transparent before the clip point is reached, never half-cropped
  // mid-word at the visible edge.
  const edgeFadeMask =
    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)";

  return (
    <section
      aria-label="Why HAFYN BUILDS"
      className="relative isolate overflow-hidden border-y border-border bg-surface/30 py-6"
    >
      {scanlines}

      <div className="relative mx-auto flex max-w-7xl items-center px-6">
        <StatusLogLabel />

        <div
          className="relative min-w-0 flex-1 overflow-hidden"
          style={{ maskImage: edgeFadeMask, WebkitMaskImage: edgeFadeMask }}
        >
          <div
            className={cn(
              "flex w-max",
              "animate-marquee",
              "hover:[animation-play-state:paused]",
              "focus-within:[animation-play-state:paused]"
            )}
          >
            {/* Two identical copies — the -50% translateX loop lands
                exactly on the start of copy 2. Both copies iterate the
                same array with the same index range (0..4), so the
                deterministic gap-cycle and marker pattern is IDENTICAL
                between copies — the seam stays perfectly invisible. */}
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} aria-hidden={copyIndex === 1} className="flex shrink-0">
                {TRUST_STATEMENTS.map((stat, i) => (
                  <LogEntry
                    key={i}
                    text={stat.text}
                    marker={stat.marker}
                    gapClassName={GAP_CLASS_CYCLE[i % GAP_CLASS_CYCLE.length]}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
