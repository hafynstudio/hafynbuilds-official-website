"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AmbientGlow } from "@/components/home/AmbientGlow";
import { BlinkingCursor } from "@/components/home/BlinkingCursor";
import { EyebrowBadge } from "@/components/home/EyebrowBadge";
import { HeroVisual } from "@/components/home/HeroVisual";
import {
  KineticHeadline,
  type HeadlineWord,
} from "@/components/home/KineticHeadline";
import { ParallaxGrid } from "@/components/home/ParallaxGrid";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, HERO_SEQUENCE_DELAYS_S } from "@/lib/motion";

const HEADLINE_WORDS: HeadlineWord[] = [
  { text: "Engineering", variant: "heavy" },
  { text: "the", variant: "light" },
  { text: "Impossible.", variant: "gradient" },
  { text: "Building", variant: "heavy" },
  { text: "What", variant: "light" },
  { text: "Matters.", variant: "gradient" },
];

/**
 * Home's Hero section (PRD §2.2.1).
 *
 * FINAL POLISH PASS: headline now uses the `.hero-heading-size` utility
 * (globals.css) — a vw+vh-blended clamp() that scales down naturally on
 * short-height viewports and a dedicated min-width+min-height media
 * query that restores dramatic scale (up to 4.25rem) on genuinely
 * spacious screens. `HeroRightColumnTexture` has been removed — its job
 * (right-column-concentrated background texture) is now handled by
 * ParallaxGrid's own left-to-right fade mask, consolidating what were
 * two separate, overlapping decorative layers into one. `bg-grain`
 * (fine noise texture) has been active on this section since Phase 1 —
 * unchanged, confirmed still present below.
 */
export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="bg-grain relative flex min-h-[calc(100dvh-var(--header-height))] items-center overflow-hidden bg-bg-primary px-6 py-6 lg:py-8">
      <AmbientGlow />
      <ParallaxGrid />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
        <div className="flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <EyebrowBadge />

          <div className="mt-4">
            <KineticHeadline
              words={HEADLINE_WORDS}
              startDelay={HERO_SEQUENCE_DELAYS_S.headline}
              trailingElement={<BlinkingCursor />}
              className="hero-heading-size leading-[1.05] tracking-tight"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: HERO_SEQUENCE_DELAYS_S.subtext,
              duration: 0.4,
              ease: EASE_OUT_EXPO,
            }}
            className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg"
          >
            The flagship software engineering &amp; AI company of the HAFYN
            technology holding group — web apps, software, AI systems, and
            enterprise solutions, engineered without compromise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: HERO_SEQUENCE_DELAYS_S.ctas,
              duration: 0.4,
              ease: EASE_OUT_EXPO,
            }}
            className="mt-6 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Button href="/contact" size="lg">
              Start a Build
            </Button>
            <Button
              href="/capabilities"
              variant="secondary"
              size="lg"
              magnetic={false}
            >
              Explore Capabilities
            </Button>
          </motion.div>
        </div>

        <div className="w-full lg:w-[26rem] lg:shrink-0">
          <HeroVisual />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
