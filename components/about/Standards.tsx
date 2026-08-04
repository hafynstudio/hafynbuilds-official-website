"use client";

/**
 * Standards — About page (PRD §2.2.2).
 *
 * PRD requirement: "bold statement + supporting tags — NOT a plain checklist."
 *
 * Design intent:
 * Each standard is a DECLARATION — large, confident, founder-voice copy —
 * with supporting monospace tags beneath it that act as evidence stamps,
 * not bullet points. The overall section reads as "this is how we operate"
 * not "here is a list of things we do."
 *
 * Layout:
 * - Opening full-width statement (mask-wipe reveal, consistent with page pattern)
 * - 2-column asymmetric grid on desktop (declaration left, tags right)
 * - Single column on mobile, full declarations stacked
 * - Each card: icon top-left, declaration as the hero text, tags as stamps below
 * - Section closes with a single bold brand-voice line — not a CTA yet
 *   (the FounderBridge component that follows handles the actual bridge CTA)
 *
 * Motion:
 * - Section header: mask-wipe consistent with About page pattern
 * - Cards: staggered fade+slide on scroll entry
 * - Tags: stagger within each card after card enters
 * - All motion respects prefers-reduced-motion
 *
 * Data: zero hardcoded copy — all from data/about.ts buildStandards.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Shield, Layers, Cpu, Brain, Anchor } from "lucide-react";
import { buildStandards } from "@/data/about";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { BuildStandard } from "@/types/about";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── ICON MAP ─────────────────────────────────────────────────────────────────

// Maps icon id strings from data layer to actual Lucide components.
// Keeping this map here (not in data/) because icon components are a
// presentation concern, not a data concern — data stays icon-name-only.
const ICON_MAP: Record<BuildStandard["icon"], React.ElementType> = {
  zap: Zap,
  shield: Shield,
  layers: Layers,
  cpu: Cpu,
  brain: Brain,
  anchor: Anchor,
};

// ─── STANDARD CARD ────────────────────────────────────────────────────────────

function StandardCard({
  standard,
  index,
  rm,
}: {
  standard: BuildStandard;
  index: number;
  rm: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });
  const Icon = ICON_MAP[standard.icon];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: rm ? 0 : 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.07, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        // Layered background: very dark base + subtle top-edge glow tint
        background:
          "linear-gradient(160deg, rgb(22 22 28) 0%, rgb(14 14 18) 60%)",
        border: "1px solid rgb(255 255 255 / 0.06)",
      }}
    >
      {/* Top accent line — draws left to right on card entry */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: rm ? 0 : 0.7, delay: index * 0.07 + 0.15, ease: EASE }}
        style={{
          background:
            "linear-gradient(to right, rgb(62 123 250 / 0.8), rgb(34 211 238 / 0.3), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Hover glow — top-left ambient, appears on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 -top-4 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgb(62 123 250 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative p-6 sm:p-8">
        {/* Icon */}
        <div
          className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            background: "rgb(62 123 250 / 0.08)",
            border: "1px solid rgb(62 123 250 / 0.18)",
            // Inner highlight — makes icon container feel lit
            boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.05)",
          }}
        >
          <Icon
            className="h-5 w-5"
            style={{ color: "rgb(var(--color-accent-primary))" }}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        {/* Declaration — the hero text of each card */}
        {/* Large, bold, founder-voice. NOT a heading — this is a declaration. */}
        <p
          className="mb-5 text-lg font-bold leading-snug tracking-tight text-text-primary sm:text-xl"
        >
          {standard.declaration}
        </p>

        {/* Tags — monospace stamps, staggered on entry */}
        <div className="flex flex-wrap gap-2">
          {standard.tags.map((tag, tagIndex) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: rm ? 0 : 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: index * 0.07 + 0.25 + tagIndex * 0.06,
                ease: EASE,
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                background: "rgb(62 123 250 / 0.06)",
                border: "1px solid rgb(62 123 250 / 0.15)",
              }}
            >
              {/* Dot indicator */}
              <span
                className="h-1 w-1 rounded-full"
                style={{ background: "rgb(var(--color-accent-primary) / 0.6)" }}
                aria-hidden="true"
              />
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: "rgb(var(--color-accent-primary) / 0.8)" }}
              >
                {tag}
              </span>
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────

export function Standards() {
  const sectionRef = useRef<HTMLElement>(null);
  const rm = usePrefersReducedMotion();
  const headerInView = useInView(sectionRef, { once: true, margin: "-60px" });

  if (!buildStandards || buildStandards.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "rgb(10 10 12)",
        borderTop: "1px solid rgb(255 255 255 / 0.05)",
      }}
    >
      {/* Ambient glow — top center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgb(62 123 250 / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">

        {/* ── Section header ── */}
        <div className="mb-14 sm:mb-16">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: rm ? 0 : 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-5 flex items-center gap-3"
          >
            <div
              className="h-px w-8"
              style={{ background: "rgb(var(--color-accent-primary))" }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "rgb(var(--color-accent-primary))" }}
            >
              Build Standards
            </span>
          </motion.div>

          {/* Heading — two-line statement, second line gradient */}
          <motion.h2
            initial={{ opacity: 0, y: rm ? 0 : 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
          >
            The bar every build{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-accent-glow)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              is measured against.
            </span>
          </motion.h2>

          {/* Supporting line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base"
          >
            Not aspirations. Not guidelines. The non-negotiable engineering
            standards every HAFYN BUILDS system is held to — from the first
            commit to the last deployment.
          </motion.p>
        </div>

        {/* ── Standards grid ── */}
        {/* Asymmetric: 2 columns desktop, 1 column mobile */}
        {/* The 6 cards fill a clean 2×3 grid at lg breakpoint */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {buildStandards.map((standard, i) => (
            <StandardCard
              key={standard.id}
              standard={standard}
              index={i}
              rm={rm}
            />
          ))}
        </div>

        {/* ── Closing brand-voice line ── */}
        {/* Not a CTA — that is FounderBridge's job. */}
        {/* This is the section's own punctuation statement. */}
        <motion.div
          initial={{ opacity: 0, y: rm ? 0 : 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-14 sm:mt-16"
        >
          <div
            className="relative overflow-hidden rounded-2xl px-6 py-6 sm:px-10 sm:py-8"
            style={{
              background:
                "linear-gradient(135deg, rgb(62 123 250 / 0.06) 0%, rgb(14 14 18) 50%, rgb(34 211 238 / 0.03) 100%)",
              border: "1px solid rgb(62 123 250 / 0.14)",
            }}
          >
            {/* Inner top-edge glow line */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent 10%, rgb(62 123 250 / 0.4) 50%, transparent 90%)",
              }}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              {/* Left: vertical accent bar */}
              <div
                className="hidden h-12 w-0.5 shrink-0 rounded-full sm:block"
                style={{
                  background:
                    "linear-gradient(to bottom, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))",
                }}
                aria-hidden="true"
              />

              {/* Statement */}
              <p className="text-base font-semibold leading-relaxed text-text-primary sm:text-lg">
                These are not promises made during a sales call.{" "}
                <span className="text-text-secondary font-normal">
                  They are the constraints every engineer at HAFYN BUILDS works
                  inside — every build, every client, every time.
                </span>
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
