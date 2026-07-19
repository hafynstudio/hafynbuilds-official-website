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

// Cursor dot tracks the pointer almost immediately (high stiffness, low
// mass); the ring trails slightly behind it for a two-layer depth effect.
export const SPRING_CURSOR_DOT = { stiffness: 800, damping: 35, mass: 0.2 };
export const SPRING_CURSOR_RING = { stiffness: 200, damping: 20, mass: 0.5 };

// Maximum pixel displacement for the magnetic button pull effect — kept
// small deliberately ("subtle cursor-proximity pull" per PRD, not a
// dramatic jump).
export const MAGNETIC_MAX_PULL_PX = 10;
