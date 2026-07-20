"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Bottom-center scroll affordance for the Hero section. Opacity is
 * driven by `scrollY` (raw pixel scroll offset from Framer Motion's
 * `useScroll`, mapped 0→200px to opacity 1→0) rather than a scroll
 * event listener + React state — this is a motion-value transform, so
 * it never triggers a React re-render while the user scrolls.
 */
export function ScrollIndicator() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
    >
      <motion.div
        animate={prefersReducedMotion ? { y: 0 } : { y: [0, 6, 0] }}
        transition={
          prefersReducedMotion
            ? { duration: 0.01 }
            : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="flex flex-col items-center gap-1 text-text-tertiary"
      >
        <span className="h-8 w-px bg-border" />
        <ChevronDown size={14} />
      </motion.div>
    </motion.div>
  );
}
