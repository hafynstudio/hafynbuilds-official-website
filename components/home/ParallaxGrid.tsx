/**
 * Decorative background layer for the Hero section — a right-column-
 * concentrated dot-grid pattern (PRD §2.2.1). Pure CSS radial-gradient
 * dots — zero image requests, zero JS cost. A `mask-image` linear-
 * gradient fades the pattern from invisible on the left (behind the
 * headline/copy, where it must not interfere with text readability) to
 * fully visible on the right (behind the terminal card).
 *
 * CURSOR SPOTLIGHT MOVED (this pass): the cursor-reactive spotlight
 * that previously lived in this component has been extracted to
 * components/ui/CursorSpotlight.tsx and is now mounted once, globally,
 * in app/layout.tsx — it follows the cursor across every section of
 * every page, not just Hero (see that component's doc comment for the
 * full rationale). This component is now a plain server component
 * (no hooks, no client-side JS) rendering ONLY the static dot-grid
 * pattern concentrated behind Hero's terminal card.
 */
export function ParallaxGrid() {
  // Fades from fully transparent at the left edge to fully opaque by
  // ~55% across — concentrates the visible dot pattern behind the right
  // column's terminal card while staying essentially invisible behind
  // the left column's headline/body text.
  const fadeMask =
    "linear-gradient(to right, transparent 0%, transparent 15%, black 55%, black 100%)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: fadeMask,
          WebkitMaskImage: fadeMask,
        }}
      />
    </div>
  );
}
