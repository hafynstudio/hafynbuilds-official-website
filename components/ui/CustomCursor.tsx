"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { SPRING_CURSOR_DOT, SPRING_CURSOR_RING } from "@/lib/motion";

const HOVER_TARGET_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';

/**
 * Mounted once, globally, in app/layout.tsx. Renders nothing (and never
 * hides the native cursor) on touch devices or when the user has
 * requested reduced motion — this is an enhancement layer, not a
 * dependency for using the site.
 */
export function CustomCursor() {
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isActive = hasFinePointer && !prefersReducedMotion;

  const [isHovering, setIsHovering] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, SPRING_CURSOR_RING);
  const ringY = useSpring(dotY, SPRING_CURSOR_RING);
  const springDotX = useSpring(dotX, SPRING_CURSOR_DOT);
  const springDotY = useSpring(dotY, SPRING_CURSOR_DOT);

  useEffect(() => {
    if (!isActive) return;

    function handlePointerMove(event: PointerEvent) {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
    }

    function handlePointerOver(event: PointerEvent) {
      const target = event.target as Element | null;
      setIsHovering(!!target?.closest(HOVER_TARGET_SELECTOR));
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);

    // Hide the native cursor only once the custom one is confirmed active
    // — avoids a flash of "no cursor at all" before JS hydrates.
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.body.style.cursor = previousCursor;
    };
  }, [isActive, dotX, dotY]);

  if (!isActive) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-cursor h-2 w-2 rounded-full bg-accent"
        style={{
          x: springDotX,
          y: springDotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-cursor h-10 w-10 rounded-full border border-white mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: isHovering ? 1 : 0, opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
