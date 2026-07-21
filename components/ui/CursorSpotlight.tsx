"use client";

import { useEffect, useRef } from "react";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Site-wide cursor-reactive ambient glow. Lives as a single, fixed,
 * full-viewport layer mounted once in app/layout.tsx so it follows the
 * cursor across every section of every page.
 *
 * STACKING FIX (this pass): the previous version used a NEGATIVE
 * z-index (`--z-cursor-spotlight: -1`), reasoning "negative = behind
 * everything." That is incorrect here and is why the glow disappeared
 * completely, including inside Hero: ordinary in-flow content with no
 * z-index (every <section> on this page) paints ABOVE negative-z-index
 * siblings regardless of DOM order, so any section's own opaque
 * background fully covered this layer everywhere.
 *
 * The token is now a POSITIVE value (25 — above ordinary section
 * content, below Header/modal/loading-screen's own z-indices), and this
 * element uses `mix-blend-mode: screen`, the same technique
 * HeroGrainOverlay already relies on. Screen blend mode can only ADD
 * light to whatever is beneath it — it is structurally incapable of
 * obscuring text or content, so a positive/"on top" z-index is safe
 * here specifically because of the blend mode, not despite it.
 *
 * Pointer position is computed from window.innerWidth/innerHeight
 * (this element is always exactly viewport-sized via `fixed`+`inset-0`)
 * rather than getBoundingClientRect(), avoiding a forced synchronous
 * layout read on every animation frame. The CSS custom property write
 * happens directly on the DOM node inside a rAF-throttled handler —
 * this never touches React state, so pointer movement causes zero
 * re-renders anywhere in the app. Gated to fine-pointer + motion-safe
 * devices; renders nothing otherwise.
 */
export function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!enabled) return;

    function handlePointerMove(e: PointerEvent) {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const node = spotlightRef.current;
        if (!node) return;
        const xPct = (e.clientX / window.innerWidth) * 100;
        const yPct = (e.clientY / window.innerHeight) * 100;
        node.style.setProperty("--spotlight-x", `${xPct}%`);
        node.style.setProperty("--spotlight-y", `${yPct}%`);
      });
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-cursor-spotlight mix-blend-screen"
      style={{
        background:
          "radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgb(var(--color-accent-glow) / 0.12), transparent 80%)",
      }}
    />
  );
}
