/**
 * Film-grain texture overlay for the Hero section.
 *
 * ROOT-CAUSE FIX: the previous implementation used `mix-blend-mode:
 * overlay` on a `::before` pseudo-element. Overlay's blend formula for
 * base colors darker than 50% gray is `result = 2 * base * blend`. Our
 * bg-primary token (rgb(10 10 11)) has luminance ~3.9%, so the formula
 * collapses to `~0.078 * blend` — a mathematical ceiling so low that no
 * amount of opacity tuning could ever make it visible. This is why two
 * prior attempts silently failed: the code was working exactly as
 * written, but `overlay` is the wrong blend mode for a base this dark.
 *
 * `screen` blend mode lightens the base proportionally to the noise
 * layer's own brightness regardless of how dark the base is
 * (`result = 1 - (1-base)(1-blend)`), which is the standard technique
 * for adding grain/texture on top of near-black surfaces. Rendered as a
 * real SVG element (not a pseudo-element) specifically so it's a
 * queryable, confirmable DOM node in DevTools.
 */
export function HeroGrainOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full opacity-[0.10] mix-blend-screen"
    >
      <filter id="hero-grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hero-grain-filter)" />
    </svg>
  );
}
