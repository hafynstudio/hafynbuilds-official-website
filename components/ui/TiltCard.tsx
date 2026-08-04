"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

// 6 degrees maximum tilt — enough to register visual depth without
// feeling vertiginous. Spring settings chosen for a snappy-but-physical
// feel: high stiffness (snaps back fast), moderate damping (no jitter).
const MAX_TILT_DEG = 6;
const TILT_SPRING = { stiffness: 200, damping: 20, mass: 0.4 };

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Cursor-reactive 3D tilt wrapper (PRD §2.2.1: "cursor-reactive tilt on
 * project cards"). Promoted to components/ui/ — this is a system-level
 * interaction pattern reusable across FeaturedWork, Blog article grid,
 * and Team grid, not a one-off Home component.
 *
 * Gated to fine-pointer + motion-safe devices only:
 * - Touch devices have no meaningful hover position → static card.
 * - prefers-reduced-motion users → static card.
 * Rotation is driven by Framer Motion values updated directly (no React
 * state) — pointer movement never triggers a re-render. Both axes are
 * transform-only (GPU-accelerated, no layout thrash).
 */
export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const tiltEnabled = hasFinePointer && !prefersReducedMotion;

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, TILT_SPRING);
  const rotateY = useSpring(rotateYRaw, TILT_SPRING);
  // Cached on pointer-enter instead of re-read on every pointermove —
  // see BUG-009: reading getBoundingClientRect() on every pointermove
  // event forces a synchronous layout flush against Framer Motion's
  // pending transform writes from the previous frame's rotateXRaw/
  // rotateYRaw.set() calls. One measurement per hover session removes
  // the interleaved read/write thrash entirely.
  const rectRef = useRef<DOMRect | null>(null);

  function handlePointerEnter() {
    if (!tiltEnabled || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!tiltEnabled || !rectRef.current) return;
    const rect = rectRef.current;
    // Normalise to -0.5 → +0.5 range centred on the card midpoint.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYRaw.set(px * MAX_TILT_DEG * 2);
    rotateXRaw.set(-py * MAX_TILT_DEG * 2);
  }

  function handlePointerLeave() {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    rectRef.current = null;
  }

  return (
    <motion.div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        transformPerspective: 800,
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
