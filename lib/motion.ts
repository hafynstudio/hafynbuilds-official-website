// Centralized motion constants — the Framer Motion/JS equivalent of
// styles/design-tokens.css. Spring physics configs and cubic-bezier
// arrays cannot be expressed as CSS custom properties, so this file is
// the single source of truth for any spring or easing value used in
// component code or GSAP timelines. Never inline a new spring config or
// bezier array directly in a component — add it here first, then import.

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

// Used for magnetic buttons and other snappy, short-travel interactions.
export const SPRING_SNAPPY = { stiffness: 300, damping: 30, mass: 0.5 };

// Used for larger, calmer motion (e.g. modal panel entrances).
export const SPRING_SMOOTH = { stiffness: 150, damping: 20, mass: 0.8 };

// Maximum pixel displacement for the magnetic button pull effect — kept
// small deliberately ("subtle cursor-proximity pull" per PRD, not a
// dramatic jump).
export const MAGNETIC_MAX_PULL_PX = 10;

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
