"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RevealSection, RevealItem } from "@/components/ui/RevealSection";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ICON_STROKE_WIDTH } from "@/lib/icons";

/**
 * Home's closing full-bleed CTA (PRD §2.2.1).
 *
 * Visual architecture (back to front):
 *   1. Base — bg-secondary for slight lift off page-primary
 *   2. Two radial gradient orbs at offset animation phases — "breathing" gradient.
 *   3. Grain noise overlay — screen blend-mode on near-black (incident #3 fix).
 *   4. Top-edge accent glow line — transparent→accent→transparent.
 *   5. Content — eyebrow, headline, sub-copy, dual CTAs, response badge.
 *
 * Response promise is rendered as a glass pill/badge with a pulsing
 * LiveDot-style indicator — makes it feel like a live system status
 * signal rather than fine-print disclaimer copy.
 *
 * All animation: transform/opacity only (GPU-safe).
 * prefers-reduced-motion: orbs static, pulse held at full opacity.
 */

export function FinalCTA() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden bg-bg-secondary">

      {/* ── Top accent glow line ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgb(var(--color-accent-primary) / 0.7) 50%, transparent 100%)",
        }}
      />

      {/* ── Breathing orb A — blue, top-left ─────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-[40rem] w-[40rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.18) 0%, transparent 70%)",
        }}
        animate={
          reduced
            ? { opacity: 0.7, scale: 1 }
            : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }
        }
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* ── Breathing orb B — cyan, bottom-right, offset phase ──────── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--color-accent-glow) / 0.12) 0%, transparent 70%)",
        }}
        animate={
          reduced
            ? { opacity: 0.6, scale: 1 }
            : { opacity: [0.3, 0.7, 0.3], scale: [1.04, 1, 1.04] }
        }
        transition={
          reduced
            ? { duration: 0.01 }
            : {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3.5,
              }
        }
      />

      {/* ── Grain noise overlay ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.035]"
        style={{ mixBlendMode: "screen" }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <RevealSection className="relative z-10 mx-auto max-w-4xl px-6 py-36 text-center">

        {/* Eyebrow */}
        <RevealItem>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Ready to begin
          </p>
        </RevealItem>

        {/* Headline */}
        <RevealItem>
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Engineering the impossible{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))",
              }}
            >
              starts here.
            </span>
          </h2>
        </RevealItem>

        {/* Sub-copy */}
        <RevealItem>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            Tell us what you&apos;re building. We&apos;ll engineer it with
            the precision, speed, and depth your business deserves.
          </p>
        </RevealItem>

        {/* ── Dual CTAs ──────────────────────────────────────────────── */}
        <RevealItem>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

            {/* Primary CTA */}
            <Button href="/contact" size="lg" variant="primary">
              Start a Build
            </Button>

            {/* Secondary CTA — bespoke glass-surface treatment */}
            <motion.a
              href="/investment"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-semibold transition-colors duration-200"
              style={{
                background: "rgb(var(--color-surface) / 0.6)",
                backdropFilter: "blur(12px)",
                boxShadow: `
                  inset 0 0 0 1px rgb(var(--color-accent-primary) / 0.35),
                  0 0 24px rgb(var(--color-accent-primary) / 0.08),
                  0 4px 16px rgb(0 0 0 / 0.3)
                `,
                color: "rgb(var(--color-accent-primary))",
              }}
              whileHover={
                reduced
                  ? {}
                  : {
                      scale: 1.02,
                      boxShadow: `
                        inset 0 0 0 1px rgb(var(--color-accent-primary) / 0.65),
                        0 0 32px rgb(var(--color-accent-primary) / 0.18),
                        0 6px 20px rgb(0 0 0 / 0.35)
                      `,
                    }
              }
              whileTap={reduced ? {} : { scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {/* Inner gradient sweep on hover */}
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--color-accent-primary) / 0.08) 0%, transparent 60%)",
                }}
                whileHover={reduced ? {} : { opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              />

              <span className="relative z-10">Explore Investment</span>

              <motion.span
                className="relative z-10 flex items-center"
                whileHover={reduced ? {} : { x: 3 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <ArrowRight
                  size={16}
                  strokeWidth={ICON_STROKE_WIDTH}
                  className="text-accent-glow"
                />
              </motion.span>
            </motion.a>

          </div>
        </RevealItem>

        {/* ── Response promise — glass pill badge ──────────────────────
            Styled as a live system-status signal (matching TrustBar's
            engineering-log aesthetic) rather than fine-print text.
            The pulsing dot signals "we are active right now" — same
            pattern as LiveDot.tsx used in the Hero and TrustBar.
        ────────────────────────────────────────────────────────────── */}
        <RevealItem>
          <div className="mt-10 flex justify-center">
            <div
              className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5"
              style={{
                background: "rgb(var(--color-surface) / 0.5)",
                backdropFilter: "blur(8px)",
                boxShadow: `
                  inset 0 0 0 1px rgb(var(--color-border) / 0.8),
                  0 2px 12px rgb(0 0 0 / 0.2)
                `,
              }}
            >
              {/* Pulsing live dot */}
              <span className="relative flex h-2 w-2 items-center justify-center">
                {/* Ping ring — fades out as it expands */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inline-flex h-full w-full rounded-full"
                  style={{
                    backgroundColor: "rgb(var(--color-accent-glow) / 0.5)",
                  }}
                  animate={
                    reduced
                      ? { opacity: 0 }
                      : { scale: [1, 2], opacity: [0.6, 0] }
                  }
                  transition={
                    reduced
                      ? { duration: 0.01 }
                      : { duration: 1.4, repeat: Infinity, ease: "easeOut" }
                  }
                />
                {/* Solid core dot */}
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: "rgb(var(--color-accent-glow))" }}
                />
              </span>

              {/* Zap icon */}
              <Zap
                size={12}
                strokeWidth={ICON_STROKE_WIDTH}
                style={{ color: "rgb(var(--color-accent-primary))" }}
                aria-hidden="true"
              />

              {/* Label */}
              <span className="font-mono text-xs font-medium text-text-secondary">
                We reply within{" "}
                <span
                  className="font-bold"
                  style={{ color: "rgb(var(--color-accent-primary))" }}
                >
                  10 minutes
                </span>
                . No commitment required.
              </span>
            </div>
          </div>
        </RevealItem>

      </RevealSection>

    </section>
  );
}
