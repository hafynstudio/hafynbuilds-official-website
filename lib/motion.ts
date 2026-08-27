// Centralized motion constants — the Framer Motion/JS equivalent of
// styles/design-tokens.css. Spring physics configs and cubic-bezier
// arrays cannot be expressed as CSS custom properties, so this file is
// the single source of truth for any spring or easing value used in
// component code or GSAP timelines. Never inline a new spring config or
// bezier array directly in a component — add it here first, then import.

export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
export const EASE_EXIT = [0.7, 0, 0.84, 0] as const;
export const EASE_MICRO = [0.25, 1, 0.5, 1] as const;
export const EASE_EMPHASIS = [0.34, 1.56, 0.64, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

// Backwards-compatible aliases used by existing components during the
// migration to semantic names.
export const EASE_OUT_EXPO = EASE_ENTRANCE;
export const EASE_OUT_QUART = EASE_MICRO;

export const MOTION_DURATION_S = {
  micro: 0.12,
  small: 0.18,
  medium: 0.32,
  large: 0.52,
  reveal: 0.7,
  staggerStep: 0.048,
} as const;

export const MOTION_DELAY_S = {
  none: 0,
  heroHeadline: 0.1,
  heroSubtext: 0.5,
  heroCta: 0.65,
  heroVisual: 0.75,
} as const;

/** Shared viewport windows for all viewport-triggered motion. */
export const MOTION_VIEWPORT_MARGIN = {
  reveal: "-80px 0px -80px 0px",
  nearViewport: "200px",
  onArrival: "0px",
  strictArrival: "0px 0px -90% 0px",
  stageActive: "-35% 0px -35% 0px",
  completion: "-18% 0px -18% 0px",
} as const;

/** Reduced motion is a readable final state: no transforms and no stagger. */
export const REDUCED_MOTION_TRANSITION = { duration: 0 } as const;

// Used for magnetic buttons and other snappy, short-travel interactions.
export const SPRING_SNAPPY = { stiffness: 300, damping: 30, mass: 0.5 };

// Used for larger, calmer motion (e.g. modal panel entrances).
export const SPRING_SMOOTH = { stiffness: 150, damping: 20, mass: 0.8 };

// Maximum pixel displacement for the magnetic button pull effect — kept
// small deliberately ("subtle cursor-proximity pull" per PRD, not a
// dramatic jump).
export const MAGNETIC_MAX_PULL_PX = 10;

// Shared physical model for cursor-reactive card depth.
export const TILT_MAX_DEG = 6;
export const TILT_SPRING = { stiffness: 200, damping: 20, mass: 0.4 };

// Hero word-by-word headline reveal. Word-level granularity: (a) lets
// each word carry its own weight/gradient treatment cleanly, since a
// letter-split would fragment a gradient-clip word mid-character, and
// (b) keeps the full combined Hero reveal inside a tight sub-900ms
// budget (fewer animated nodes than per-letter).
export const HERO_WORD_STAGGER_S = 0.04;
export const HERO_WORD_TRANSITION = { duration: 0.35, ease: EASE_OUT_EXPO };

// Full Hero choreography, in seconds, relative to mount. Elements
// deliberately overlap (each starts before the previous fully resolves)
// rather than running strictly end-to-end — this is what makes a
// multi-element reveal feel fast/cohesive rather than slow and additive.
export const HERO_SEQUENCE_DELAYS_S = {
  eyebrow: 0,
  headline: 0.1,
  subtext: 0.5,
  ctas: 0.65,
  visualPanel: 0.75,
} as const;

/**
 * Static RGB literal constants — used ONLY inside Framer Motion animated
 * color values (boxShadow, borderColor, etc. inside `animate`/`whileHover`/
 * `initial` objects). Framer Motion's color interpolator cannot parse
 * `rgb(var(--color-x) / a)` — it needs a literal, resolvable color string,
 * and silently fails with "... is not an animatable color" otherwise
 * (confirmed console bug, About page — Ecosystem Diagram + Vision pills).
 *
 * These values MUST mirror styles/design-tokens.css exactly. Static
 * (non-animated) styles should keep using `rgb(var(--color-x) / a)` as
 * normal — this pair exists solely to unblock JS-driven color animation.
 */
export const ACCENT_PRIMARY_RGB = "62, 123, 250";
export const ACCENT_GLOW_RGB = "34, 211, 238";

/**
 * Shared Framer-Motion-safe color token set — promoted from a local
 * `TOKEN` object originally defined only inside CapabilitiesTeaser.tsx
 * (Phase 4). Promoted to lib/motion.ts once Phase 8's DeployedInterfaces.tsx
 * became a second real consumer needing the identical values — this file's
 * own header comment already commits to being the single source of truth
 * for exactly this kind of value, so duplicating it a second time would
 * have violated that stated contract.
 *
 * Space-separated triplet format (distinct from the comma-separated
 * ACCENT_PRIMARY_RGB/ACCENT_GLOW_RGB pair above) matches the
 * `rgb(r g b / a)` CSS Color Module 4 syntax used throughout
 * design-tokens.css. rgbaToken() below builds a legal CSS color string
 * that Framer Motion's color interpolator can parse directly.
 *
 * Kept manually in sync with styles/design-tokens.css — only 5 values,
 * changed only during a full palette revision, not a routine edit.
 */
export const FRAMER_COLOR_TOKENS = {
  accent: "62 123 250",
  accentGlow: "34 211 238",
  success: "34 197 94",
  white: "255 255 255",
} as const;

export function rgbaToken(
  triplet: (typeof FRAMER_COLOR_TOKENS)[keyof typeof FRAMER_COLOR_TOKENS],
  alpha: number
): string {
  return `rgb(${triplet} / ${alpha})`;
}
