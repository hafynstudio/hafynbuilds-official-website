"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  EASE_MICRO,
  MOTION_DURATION_S,
  MOTION_VIEWPORT_MARGIN,
} from "@/lib/motion";

// PRD §3.2 specifies: "fade + slide-up 20–30px, 0.6–0.8s ease-out,
// Intersection-Observer-triggered" and "staggered children 80–100ms".
// Values chosen at the mid-point of each specified range.
const REVEAL_DISTANCE_PX = 24;
const REVEAL_DURATION_S = MOTION_DURATION_S.reveal;
// Shared margin fires the observer while the element is still ~80px below
// the viewport bottom — reveals feel anticipatory, not delayed.
const REVEAL_MARGIN = MOTION_VIEWPORT_MARGIN.reveal;

// Framer Motion supports only the five HTML tags enumerated below as
// typed motion components — kept as a constrained map rather than a
// generic `motion[as]` to preserve strict TypeScript inference.
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  li: motion.li,
} as const;

type RevealAs = keyof typeof MOTION_TAGS;

// Full motion variants — used when prefers-reduced-motion is false.
const fullVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE_PX },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION_S, ease: EASE_MICRO },
  },
};

// Reduced-motion variants — instant opacity flip, zero animation cost.
const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  as?: RevealAs;
  /**
   * > 0 switches this into orchestration-only mode: the wrapper itself
   * applies no visible motion — it only provides stagger timing to its
   * variant-aware children. Direct children must be wrapped in
   * <RevealItem> to actually animate. Omit (or pass 0) for a single-
   * element reveal where RevealSection itself is the animating node.
   */
  stagger?: number;
  delay?: number;
}

/**
 * Sitewide scroll-reveal primitive (PRD §3.2). Every page section reveal
 * across all 9 pages uses this component — never reimplements its own
 * IntersectionObserver + motion variants. This is what keeps the reveal
 * timing and easing consistent across the whole site per the Master Build
 * Prompt's consistency requirement. Triggers once (`once: true`) — a
 * re-trigger on scroll-back reads as glitchy, not polished.
 */
export function RevealSection({
  children,
  className,
  as = "div",
  stagger = 0,
  delay = 0,
}: RevealSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: REVEAL_MARGIN });
  const prefersReducedMotion = usePrefersReducedMotion();
  const MotionTag = MOTION_TAGS[as];
  const variants = prefersReducedMotion ? reducedVariants : fullVariants;

  if (stagger <= 0) {
    return (
      <MotionTag
        ref={ref}
        className={className}
        initial={false}
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={false}
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: prefersReducedMotion
            ? { staggerChildren: 0, delayChildren: 0 }
            : { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Direct child of a staggered `<RevealSection stagger={n}>`. Inherits
 * "hidden"/"visible" state via Framer Motion variant propagation — no
 * own initial/animate props needed. Renders as a plain motion.div so it
 * wraps any child without imposing layout constraints.
 */
export function RevealItem({ children, className }: RevealItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = prefersReducedMotion ? reducedVariants : fullVariants;
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
