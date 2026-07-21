"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { RevealSection } from "@/components/ui/RevealSection";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Home's closing full-bleed CTA (PRD §2.2.1). A slow "breathing"
 * gradient (opacity pulse, GPU-safe — transform/opacity only) anchors
 * the section visually without competing with the headline. Deliberately
 * the calmest animation on the page — this section ends the scroll
 * journey with confidence, not more kinetic energy.
 *
 * The gradient is decorative (aria-hidden) and the section has a
 * real semantic heading, so screen readers experience only the copy.
 */
export function FinalCTA() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-border px-6 py-32 text-center">

      {/* Breathing gradient background — opacity animation only */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-glow/20"
        animate={
          prefersReducedMotion
            ? { opacity: 0.6 }
            : { opacity: [0.4, 0.7, 0.4] }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.01 }
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <RevealSection className="relative mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-text-primary sm:text-5xl">
          Let&apos;s build what matters.
        </h2>
        <p className="mt-4 text-lg text-text-secondary">
          Tell us what you&apos;re building — we&apos;ll tell you exactly how
          we&apos;d engineer it.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/contact" size="lg">
            Start a Build
          </Button>
        </div>
      </RevealSection>

    </section>
  );
}
