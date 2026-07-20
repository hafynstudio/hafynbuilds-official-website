"use client";

import { Fragment, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { HERO_WORD_STAGGER_S, HERO_WORD_TRANSITION } from "@/lib/motion";

export type HeadlineWordVariant = "heavy" | "light" | "gradient";

export interface HeadlineWord {
  text: string;
  variant: HeadlineWordVariant;
}

interface KineticHeadlineProps {
  words: HeadlineWord[];
  className?: string;
  /** Seconds to wait before this headline's own word-stagger sequence
   * begins — lets Hero.tsx choreograph eyebrow → headline → subtext →
   * CTAs as one overlapping sequence rather than each component picking
   * its own arbitrary start time. */
  startDelay?: number;
  /** Rendered as the final inline child, immediately after the last
   * word, still inside the same aria-hidden animated flow (used by
   * Hero.tsx for the blinking terminal-style caret after "Matters."). */
  trailingElement?: ReactNode;
}

// Deterministic per-word angle cycle for the "dropped in at an angle"
// initial pose. Deliberately NOT Math.random() — a random value would
// differ between server-rendered HTML and the client hydration pass,
// producing a hydration mismatch. A small fixed cycle stays visually
// varied while being byte-identical across SSR and CSR.
const DROP_ANGLES_DEG = [-10, 7, -8, 9, -6, 8];

// Mixed weight/color treatment per word — connector words ("the", "What")
// read lighter and quieter, power words ("Impossible.", "Matters.") carry
// the brand's blue→cyan gradient, structural words ("Engineering",
// "Building") stay solid bold white. This is what breaks the headline
// out of a flat, single-weight block.
const VARIANT_CLASSES: Record<HeadlineWordVariant, string> = {
  heavy: "font-bold text-text-primary",
  light: "font-medium text-text-tertiary",
  gradient:
    "font-bold bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent",
};

/**
 * Home's Hero-only kinetic text reveal — deliberately distinct from the
 * mask-wipe reveal used for every other page's opening statement (About,
 * Capabilities, Method, Investment, Blog, Contact per PRD §3.2). Animates
 * word-by-word rather than letter-by-letter, both to hit a tight
 * sub-900ms combined reveal budget and to give each word its own
 * weight/color treatment without fragmenting a gradient-clip word
 * mid-character. The visible text is exposed once via aria-label on the
 * heading itself; the animated word spans are aria-hidden duplicates, so
 * screen readers announce the headline once, correctly.
 */
export function KineticHeadline({
  words,
  className,
  startDelay = 0,
  trailingElement,
}: KineticHeadlineProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const fullText = words.map((w) => w.text).join(" ");

  return (
    <h1 className={className} aria-label={fullText}>
      <motion.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              delayChildren: startDelay,
              staggerChildren: HERO_WORD_STAGGER_S,
            },
          },
        }}
      >
        {words.map((word, index) => {
          const angle = prefersReducedMotion
            ? 0
            : DROP_ANGLES_DEG[index % DROP_ANGLES_DEG.length];

          return (
            <Fragment key={index}>
              <motion.span
                className={cn("inline-block", VARIANT_CLASSES[word.variant])}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : -20,
                    rotate: angle,
                  },
                  visible: { opacity: 1, y: 0, rotate: 0 },
                }}
                transition={HERO_WORD_TRANSITION}
              >
                {word.text}
              </motion.span>
              {index < words.length - 1 ? " " : trailingElement}
            </Fragment>
          );
        })}
      </motion.span>
    </h1>
  );
}
