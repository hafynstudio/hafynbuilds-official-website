"use client";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Terminal-style blinking caret rendered immediately after the Hero
 * headline's final word — a deliberate brand element (not an accidental
 * artifact) that reinforces the "engineering/build" identity, echoing
 * the code-morph and live-deploy motifs used later on Capabilities and
 * Method. Uses the `animate-caret-blink` token-driven utility rather
 * than an inline animation.
 */
export function BlinkingCursor() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] rounded-sm bg-accent align-middle",
        !prefersReducedMotion && "animate-caret-blink"
      )}
    />
  );
}
