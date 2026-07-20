"use client";

import { useEffect, useRef } from "react";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Decorative background layer for the Hero section — combines the base
 * grid texture with a cursor-reactive spotlight (PRD §2.2.1). The grid
 * lines are a pure CSS repeating-gradient — zero image requests, zero
 * JS cost. A `mask-image` linear-gradient fades the grid from invisible
 * on the left (behind the headline/copy, where it must not interfere
 * with text readability) to fully visible on the right (behind the
 * terminal card, filling what was previously flat empty space) — this
 * single layer replaces what was originally two separate, slightly
 * inconsistent texture components (a full-width line-grid here plus a
 * right-column-only dot-grid in a since-removed HeroRightColumnTexture
 * component); consolidating avoids redundant overlapping decorative
 * layers doing the same conceptual job two different ways.
 *
 * On fine-pointer, motion-safe devices only, a radial "spotlight"
 * gradient additionally tracks the cursor via a CSS custom property
 * updated directly on the DOM node inside a rAF-throttled pointermove
 * handler — this never touches React state, so pointer movement causes
 * zero re-renders.
 */
export function ParallaxGrid() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const spotlightEnabled = hasFinePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!spotlightEnabled) return;

    function handlePointerMove(e: PointerEvent) {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const node = spotlightRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        node.style.setProperty("--spotlight-x", `${xPct}%`);
        node.style.setProperty("--spotlight-y", `${yPct}%`);
      });
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [spotlightEnabled]);

  // Fades from fully transparent at the left edge to fully opaque by
  // ~55% across — concentrates visible texture behind the right
  // column's terminal card while staying essentially invisible behind
  // the left column's headline/body text.
  const fadeMask =
    "linear-gradient(to right, transparent 0%, transparent 15%, black 55%, black 100%)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(var(--color-border)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--color-border)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: fadeMask,
          WebkitMaskImage: fadeMask,
        }}
      />

      {spotlightEnabled && (
        <div
          ref={spotlightRef}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgb(var(--color-accent-glow) / 0.12), transparent 80%)",
          }}
        />
      )}
    </div>
  );
}
