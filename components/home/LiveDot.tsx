"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Small pulsing "live status" indicator (ping + solid dot) — shared
 * between EyebrowBadge and HeroVisual so this exact treatment isn't
 * duplicated in two places with subtly different timing. Mirrors real
 * deployment-status UI (Vercel, GitHub Actions) rather than reading as a
 * decorative flourish.
 */
export function LiveDot() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
      {!prefersReducedMotion && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-accent"
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
    </span>
  );
}
