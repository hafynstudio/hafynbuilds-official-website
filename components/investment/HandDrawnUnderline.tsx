"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface HandDrawnUnderlineProps {
  className?: string;
  /** CSS color value for the stroke, e.g. "rgb(62 123 250)" */
  color?: string;
  strokeWidth?: number;
}

// Inline SVG squiggle underline for emphasized words in the Investment
// hero headline. Fades in via a compositor-only opacity transition on
// mount (BUG-024: replaced stroke-dashoffset draw-in which was a
// non-composited paint-layer property). The path is deliberately asymmetric
// (uneven dips) \u2014 an organic, hand-drawn feel is the whole point,
// versus a perfectly-straight underline which would read as generic.
//
// Reduced-motion: the underline still appears (it's information, not
// decoration \u2014 it emphasizes a specific word) but skips the
// draw-in animation and renders in its final state immediately.
export function HandDrawnUnderline({
  className,
  color = "rgb(62 123 250)",
  strokeWidth = 3,
}: HandDrawnUnderlineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    if (prefersReduced) {
      // Reduced-motion: show immediately, no animation.
      path.style.opacity = "1";
      return;
    }

    // Opacity fade-in replaces stroke-dashoffset draw-in (BUG-024 fix).
    // stroke-dashoffset is a paint-layer SVG property (non-composited),
    // triggering repaint every frame. opacity is compositor-only (zero
    // paint cost). The visual result is a smooth reveal rather than a
    // draw-in, perceptually equivalent at 0.8s duration.
    // rAF ensures the initial opacity:0 is committed to the compositor
    // before the transition starts - same browser-batching guard as the
    // original dashoffset pattern.
    path.style.opacity = "0";
    const frame = requestAnimationFrame(() => {
      path.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s";
      path.style.opacity = "1";
    });

    return () => cancelAnimationFrame(frame);
  }, [prefersReduced]);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      className={cn(
        "absolute left-0 w-full overflow-visible",
        className
      )}
      style={{ bottom: "-6px", height: "12px" }}
    >
      <path
        ref={pathRef}
        // Asymmetric wave \u2014 slight dip at 1/3 rising to a peak at 2/3.
        // Cubic beziers keep it organic; a straight line or a perfect
        // sine curve would kill the "hand-drawn" reading immediately.
        d="M2,7 C30,3 60,10 90,6 C120,2 150,9 198,5"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
