"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HandDrawnUnderline } from "./HandDrawnUnderline";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useCurrency } from "@/lib/currency/context";
import { EASE_OUT_EXPO } from "@/lib/motion";

// Investment page opening.
//
// Design intent:
//   - Confident, not shouty. The old text-6xl felt like a shouting header;
//     text-5xl -> text-7xl at desktop reads as "premium editorial" scale.
//   - "Ever." gets emphasis instead of being muted — it's the confident
//     short-stop after "Never a template." Full stop is the point, not
//     a fade-out.
//   - Hand-drawn underline made bolder (strokeWidth 3.5) — it's a
//     signature moment, not decoration. Should read at a glance.
//   - Live founding-slots status pill: engineering-native atmosphere +
//     communicates real-time scarcity without being pushy. Pulls
//     directly from foundingConfig — same source of truth as the cards.
//   - Layered radial glow behind headline adds vertical depth so the
//     text sits ON the blueprint grid, not floating above it detached.
//   - Overall tighter vertical rhythm: no massive empty top/bottom void.

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const LINE = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export function InvestmentHero() {
  const prefersReduced = usePrefersReducedMotion();
  const { foundingConfig } = useCurrency();
  const slots = foundingConfig.foundingClientSlotsRemaining;
  const showLiveStatus = foundingConfig.foundingPricingActive && slots > 0;

  return (
    <section
      aria-label="Investment page introduction"
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16 text-center sm:pt-24"
    >
      {/* Layered radial glow behind headline — depth cue so text sits
          on the blueprint grid rather than floating detached.
          Pure CSS radial-gradient, compositor-only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(62,123,250,0.08), transparent 70%)",
        }}
      />

      <motion.div
        variants={prefersReduced ? undefined : STAGGER}
        initial={prefersReduced ? undefined : "hidden"}
        animate={prefersReduced ? undefined : "visible"}
        className="relative mx-auto max-w-5xl"
      >
        {/* Eyebrow */}
        <motion.p
          variants={prefersReduced ? undefined : LINE}
          className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent"
        >
          — Build Spec —
        </motion.p>

        {/* Live status pill — real-time atmosphere, engineering-native */}
        {showLiveStatus && (
          <motion.div
            variants={prefersReduced ? undefined : LINE}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-badge-founding/30 bg-badge-founding/[0.06] px-3.5 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={
                  prefersReduced
                    ? "absolute inline-flex h-full w-full rounded-full bg-badge-founding/60"
                    : "absolute inline-flex h-full w-full animate-ping rounded-full bg-badge-founding/60"
                }
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-badge-founding" />
            </span>
            <span className="font-mono text-[11px] font-medium tracking-wide text-badge-founding">
              Currently accepting {slots} founding client
              {slots === 1 ? "" : "s"} · Founding pricing active
            </span>
          </motion.div>
        )}

        {/* Headline — scale tightened, "Ever." now confident not muted */}
        <motion.h1
          variants={prefersReduced ? undefined : LINE}
          className="mb-7 text-5xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
        >
          Every website{" "}
          <span className="relative inline-block whitespace-nowrap">
            hand-coded.
            <HandDrawnUnderline color="rgb(62 123 250)" strokeWidth={3.5} />
          </span>
          <br />
          Never a template.{" "}
          <span className="relative inline-block">
            Ever.
            {/* Confident period accent — tiny dot after "Ever." reinforcing
                the full-stop character. aria-hidden — the period itself
                is already in the text above. */}
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent"
            />
          </span>
        </motion.h1>

        {/* Sub-copy — trimmed to one confident line */}
        <motion.p
          variants={prefersReduced ? undefined : LINE}
          className="mx-auto mb-12 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          Locally-calibrated pricing across 28 countries. Choose your
          foundation below — or explore industry-specific solutions.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          variants={prefersReduced ? undefined : LINE}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={prefersReduced ? undefined : { y: [0, 6, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          >
            <ArrowDown size={18} className="text-text-tertiary" />
          </motion.div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
            Scroll to explore
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
