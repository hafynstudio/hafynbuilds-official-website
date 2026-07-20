"use client";

import { useEffect, useRef } from "react";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Decorative background layer for the Hero section — a right-column-
 * concentrated dot-grid pattern plus a cursor-reactive spotlight
 * (PRD §2.2.1). Pure CSS radial-gradient dots — zero image requests,
 * zero JS cost for the static pattern itself. A `mask-image`
 * linear-gradient fades the pattern from invisible on the left (behind
 * the headline/copy, where it must not interfere with text readability)
 * to fully visible on the right (behind the terminal card).
 *
 * Explicit `z-[1]` stacking — sits above the section's base background
 * color but below HeroGrainOverlay (z-[2]) and the content column
 * (z-10), per the layering fix: background → grid (z-1) → grain (z-2)
 * → content (z-10+).
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
