"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

/**
 * AboutHero — mask-wipe opening statement (PRD §2.2.2).
 *
 * Mask-wipe technique: each line sits in an overflow-hidden clip
 * container; the inner span translates y+105% → y:0 on entry. Text
 * is never conditionally rendered — only animation state changes on
 * isInView, which avoids the layout-jump bug from the previous pass.
 *
 * Eyebrow badge: reuses the glass-pill + pulsing-dot pattern
 * established in FinalCTA's response-promise badge — this is a system
 * pattern now, not a one-off, so it appears here as the page-opening
 * signature element too.
 *
 * Background depth (back to front):
 *   1. Dot-grid texture (blueprint/engineering aesthetic, very low opacity)
 *   2. Dual ambient glow orbs (blue center-top, cyan lower-right) — same
 *      "breathing" language as Hero/FinalCTA
 *   3. Grain overlay (screen blend, consistent with every dark section)
 *   4. Content
 *
 * Corner brackets: positioned relative to the headline's own inline-block
 * box, so they automatically hug whatever the widest rendered line is —
 * no manual width math needed even if copy changes.
 */

export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const reduced = usePrefersReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 16 },
    animate: isInView
      ? { opacity: 1, y: 0 }
      : reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 16 },
    transition: { duration: reduced ? 0 : 0.6, delay, ease: EASE_OUT_QUART },
  });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg-primary px-6 pb-20 pt-28"
      aria-labelledby="about-hero-heading"
    >

      {/* ── Dot-grid texture — blueprint aesthetic ──────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(var(--color-border)) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 75%)",
        }}
      />

      {/* ── Ambient glow — orb A, blue, center-top ──────────────────── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: "820px",
          height: "480px",
          background:
            "radial-gradient(ellipse at center, rgb(var(--color-accent-primary) / 0.14) 0%, transparent 68%)",
        }}
        animate={reduced ? { opacity: 0.8 } : { opacity: [0.6, 1, 0.6] }}
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* ── Ambient glow — orb B, cyan, lower-right, offset phase ───── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0"
        style={{
          width: "480px",
          height: "420px",
          background:
            "radial-gradient(ellipse at center, rgb(var(--color-accent-glow) / 0.09) 0%, transparent 70%)",
        }}
        animate={reduced ? { opacity: 0.6 } : { opacity: [0.3, 0.6, 0.3] }}
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }
        }
      />

      {/* ── Grain overlay ────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]"
        style={{ mixBlendMode: "screen" }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">

        {/* Eyebrow — glass pill badge, matches FinalCTA response badge */}
        <motion.div
          className="mb-10 inline-flex items-center gap-2.5 rounded-full px-4 py-2"
          style={{
            background: "rgb(var(--color-surface) / 0.5)",
            backdropFilter: "blur(8px)",
            boxShadow: "inset 0 0 0 1px rgb(var(--color-border) / 0.9)",
          }}
          {...fadeUp(0.1)}
        >
          <span className="relative flex h-1.5 w-1.5 items-center justify-center">
            <motion.span
              aria-hidden="true"
              className="absolute inline-flex h-full w-full rounded-full"
              style={{ backgroundColor: "rgb(var(--color-accent-primary) / 0.5)" }}
              animate={
                reduced ? { opacity: 0 } : { scale: [1, 2.2], opacity: [0.6, 0] }
              }
              transition={
                reduced
                  ? { duration: 0.01 }
                  : { duration: 1.6, repeat: Infinity, ease: "easeOut" }
              }
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "rgb(var(--color-accent-primary))" }}
            />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-secondary">
            About HAFYN BUILDS
          </span>
        </motion.div>

        {/* ── Headline with blueprint corner brackets ───────────────── */}
        <div className="relative inline-block px-2 py-1">

          {/* Corner bracket — top-left, with tick mark */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -left-6 -top-5 h-9 w-9 sm:-left-8 sm:-top-6 sm:h-11 sm:w-11"
            viewBox="0 0 44 44"
            fill="none"
          >
            <motion.path
              d="M 36 5 L 5 5 L 5 36"
              stroke="rgb(var(--color-accent-primary) / 0.45)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: reduced ? 0 : 0.7, delay: 0.75, ease: EASE_OUT_QUART }}
            />
            <motion.circle
              cx="5" cy="5" r="2"
              fill="rgb(var(--color-accent-primary) / 0.6)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3, delay: 1.45 }}
            />
          </svg>

          {/* Corner bracket — top-right */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-5 h-9 w-9 sm:-right-8 sm:-top-6 sm:h-11 sm:w-11"
            viewBox="0 0 44 44"
            fill="none"
          >
            <motion.path
              d="M 8 5 L 39 5 L 39 36"
              stroke="rgb(var(--color-accent-primary) / 0.45)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: reduced ? 0 : 0.7, delay: 0.9, ease: EASE_OUT_QUART }}
            />
            <motion.circle
              cx="39" cy="5" r="2"
              fill="rgb(var(--color-accent-primary) / 0.6)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3, delay: 1.6 }}
            />
          </svg>

          {/* Corner bracket — bottom-left */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-5 -left-6 h-9 w-9 sm:-bottom-6 sm:-left-8 sm:h-11 sm:w-11"
            viewBox="0 0 44 44"
            fill="none"
          >
            <motion.path
              d="M 36 39 L 5 39 L 5 8"
              stroke="rgb(var(--color-accent-glow) / 0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: reduced ? 0 : 0.7, delay: 1.05, ease: EASE_OUT_QUART }}
            />
            <motion.circle
              cx="5" cy="39" r="2"
              fill="rgb(var(--color-accent-glow) / 0.5)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3, delay: 1.75 }}
            />
          </svg>

          {/* Corner bracket — bottom-right */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-5 -right-6 h-9 w-9 sm:-bottom-6 sm:-right-8 sm:h-11 sm:w-11"
            viewBox="0 0 44 44"
            fill="none"
          >
            <motion.path
              d="M 8 39 L 39 39 L 39 8"
              stroke="rgb(var(--color-accent-glow) / 0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: reduced ? 0 : 0.7, delay: 1.2, ease: EASE_OUT_QUART }}
            />
            <motion.circle
              cx="39" cy="39" r="2"
              fill="rgb(var(--color-accent-glow) / 0.5)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3, delay: 1.9 }}
            />
          </svg>

          {/* ── The headline — two lines, mask-wipe per line ────────── */}
          <h1
            id="about-hero-heading"
            className="font-bold tracking-tight text-text-primary"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", lineHeight: 1.14 }}
          >
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={false}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : { duration: 0.8, delay: 0.25, ease: EASE_OUT_EXPO }
                }
              >
                We don&apos;t build solutions.
              </motion.span>
            </span>

            <span className="mt-1 block overflow-hidden">
              <motion.span
                className="block"
                initial={false}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : { duration: 0.8, delay: 0.42, ease: EASE_OUT_EXPO }
                }
              >
                We engineer{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))",
                  }}
                >
                  futures.
                </span>
              </motion.span>
            </span>
          </h1>

        </div>
        {/* end headline wrapper */}

        {/* Sub-statement */}
        <motion.p
          className="mx-auto mt-10 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          {...fadeUp(0.75)}
        >
          HAFYN BUILDS is where engineering ambition meets execution
          discipline. This is the story of why we exist, how we think,
          and what we&apos;re building — for you, and for the future.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2.5"
          aria-hidden="true"
          {...fadeUp(1.1)}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-disabled">
            Scroll to explore
          </span>
          <div className="relative h-9 w-px overflow-hidden rounded-full bg-border/60">
            <motion.div
              className="absolute inset-x-0 top-0 h-full w-full rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgb(var(--color-accent-primary)), transparent)",
              }}
              animate={
                reduced ? {} : { y: ["-100%", "100%"] }
              }
              transition={{
                duration: reduced ? 0 : 1.6,
                repeat: reduced ? 0 : Infinity,
                ease: "easeInOut",
                delay: reduced ? 0 : 1.5,
              }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
