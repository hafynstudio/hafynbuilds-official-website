"use client";

import { motion } from "framer-motion";
import { LiveDot } from "@/components/home/LiveDot";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { HERO_SEQUENCE_DELAYS_S } from "@/lib/motion";

// Grounded directly in PRD §1.2 ("virtually every legitimate business/
// industry — 100+/200+ industries") — not an invented statistic. This is
// the element that breaks the Hero's vertical monotony, sitting above
// the headline.
const EYEBROW_TEXT = "Engineering for 100+ industries";

/**
 * Small status-pill above the Hero headline. Font-mono ties it to the
 * brand's "engineering-native" identity, reused again on Capabilities'
 * terminal aesthetic.
 */
export function EyebrowBadge() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: HERO_SEQUENCE_DELAYS_S.eyebrow, duration: 0.3 }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 font-mono text-xs text-text-secondary backdrop-blur-sm"
    >
      <LiveDot />
      {EYEBROW_TEXT}
    </motion.div>
  );
}
