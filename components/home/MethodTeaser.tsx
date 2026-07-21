"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { methodStages } from "@/data/method-stages";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Home Method Teaser (PRD §2.2.1) — introduces the 5-stage sequential
 * pipeline that the full "Live Deploy" page (Phase 9) pays off with
 * GSAP ScrollTrigger cinematic treatment.
 *
 * DELIBERATE RESTRAINT: this teaser uses Framer Motion scroll-reveal
 * only — no ScrollTrigger, no scrubbed timelines. The cinematic
 * version is reserved for Phase 9 so it lands with full impact on
 * first encounter, rather than being diluted by a preview here.
 *
 * DESIGN LANGUAGE:
 * - Dark canvas section (bg-bg-secondary) — distinct from the
 *   Capabilities section above (bg-primary) for clear rhythm
 * - Horizontal node track on desktop, vertical on mobile
 * - Connecting line: a static gradient track (bg-tertiary) with an
 *   animated accent fill that grows to cover it as nodes enter view —
 *   suggests "progress through a pipeline" without needing GSAP
 * - Each node: a small terminal-style status card. The featured node
 *   (Build) gets an accent border + glow — the clear visual anchor
 * - Status labels (statusLabel field) shown below each node in
 *   monospace — extends the terminal/deploy motif from Hero/TrustBar
 * - Background: continuation of the same radial dot-grid pattern
 *   used in Hero and Capabilities, maintaining visual consistency
 *
 * MOBILE: nodes stack vertically, connecting line becomes a left-edge
 * vertical accent bar (same CSS, different flex direction).
 *
 * COLOR ANIMATION NOTE: all colors inside animate={{}} use plain
 * resolved rgb() strings (no CSS var() references) — Framer Motion
 * cannot tween CSS custom properties. This follows the TOKEN/rgba()
 * convention established in CapabilitiesTeaser.tsx.
 */

// Resolved color tokens for Framer Motion animate={{}} only
const T = {
  accent: "62 123 250",
  accentGlow: "34 211 238",
  white: "255 255 255",
} as const;

function rgb(triplet: string, alpha: number) {
  return `rgb(${triplet} / ${alpha})`;
}

interface StageNodeProps {
  stage: (typeof methodStages)[0];
  index: number;
  total: number;
  inView: boolean;
  reducedMotion: boolean;
}

function StageNode({ stage, index, total, inView, reducedMotion }: StageNodeProps) {
  const isFeatured = stage.isFeatured;
  const isLast = index === total - 1;

  return (
    <div className="group relative flex flex-1 flex-col items-center">

      {/* ── NODE CARD ────────────────────────────────────────────── */}
      <motion.div
        className={cn(
          "relative flex w-full max-w-[160px] flex-col overflow-hidden rounded-xl border p-3 backdrop-blur-sm",
          isFeatured
            ? "border-accent/40 bg-surface/80 shadow-glow-accent"
            : "border-border bg-surface/40"
        )}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.55,
          delay: index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Featured glow orb */}
        {isFeatured && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-accent opacity-[0.12] blur-2xl"
          />
        )}

        {/* Top highlight line */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 h-[1px]",
            isFeatured
              ? "bg-gradient-to-r from-transparent via-accent/60 to-transparent"
              : "bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
          )}
        />

        {/* Stage number + status dot */}
        <div className="mb-2 flex items-center justify-between">
          <span
            className={cn(
              "font-mono text-[10px] font-medium",
              isFeatured ? "text-accent" : "text-text-tertiary"
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Pulsing dot on featured, static on others */}
          {isFeatured ? (
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={reducedMotion ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-border" aria-hidden="true" />
          )}
        </div>

        {/* Stage name */}
        <h3
          className={cn(
            "text-sm font-semibold leading-tight",
            isFeatured ? "text-text-primary" : "text-text-secondary"
          )}
        >
          {stage.name}
        </h3>

        {/* Status label — terminal log line */}
        <p
          className={cn(
            "mt-1.5 font-mono text-[9px] leading-tight",
            isFeatured ? "text-accent/80" : "text-text-tertiary"
          )}
        >
          {isFeatured ? `[~] ${stage.statusLabel}` : `[✓] ${stage.statusLabel}`}
        </p>
      </motion.div>

      {/* ── CONNECTOR LINE (hidden on last node) ─────────────────── */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="absolute top-[52px] hidden h-[1px] w-[calc(100%-160px)] translate-x-[80px] overflow-hidden rounded-full bg-border lg:block"
          style={{ left: "50%", width: "calc(100% - 80px)", transform: "none", right: 0, left: "calc(80px)" }}
        >
          {/* Animated accent fill — grows left-to-right as section enters view.
              Only fills up to the "Build" node (featured, index 2 = 60% across
              5 nodes) to suggest "this is where we are now in the process." */}
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent/30"
            initial={{ width: "0%" }}
            animate={inView ? { width: index < 2 ? "100%" : "0%" } : { width: "0%" }}
            transition={{
              duration: reducedMotion ? 0 : 0.6,
              delay: reducedMotion ? 0 : index * 0.15 + 0.4,
              ease: [0.25, 1, 0.5, 1],
            }}
          />
        </div>
      )}

      {/* ── SHORT DESCRIPTION (below card, desktop only) ─────────── */}
      <motion.p
        className="mt-3 hidden text-center text-[11px] leading-relaxed text-text-tertiary lg:block"
        style={{ maxWidth: 140 }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.25 }}
      >
        {stage.shortDescription.split(" ").slice(0, 8).join(" ")}
        {stage.shortDescription.split(" ").length > 8 ? "…" : ""}
      </motion.p>
    </div>
  );
}

// ─── MOBILE VERTICAL STAGE ROW ────────────────────────────────────────────────
// On mobile the horizontal pipeline becomes a vertical left-to-right
// readable list — each row is a mini card with a left-edge accent line
// connecting nodes, a cleaner read on small screens than a cramped
// horizontal layout would be.

function MobileStageRow({
  stage,
  index,
  total,
  inView,
  reducedMotion,
}: StageNodeProps) {
  const isFeatured = stage.isFeatured;
  const isLast = index === total - 1;

  return (
    <div className="relative flex gap-4">

      {/* Left-edge track + node dot */}
      <div className="flex flex-col items-center">
        {/* Node circle */}
        <motion.div
          className={cn(
            "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-semibold",
            isFeatured
              ? "border-accent/50 bg-surface text-accent shadow-[0_0_12px_rgb(62_123_250/0.2)]"
              : "border-border bg-surface text-text-tertiary"
          )}
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.09, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {String(index + 1).padStart(2, "0")}
          {/* Pulse ring on featured */}
          {isFeatured && !reducedMotion && (
            <motion.span
              className="absolute inset-0 rounded-full border border-accent/30"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              aria-hidden="true"
            />
          )}
        </motion.div>

        {/* Vertical connector line */}
        {!isLast && (
          <div className="relative mt-1 w-px flex-1 bg-border" style={{ minHeight: 24 }}>
            <motion.div
              className="absolute inset-x-0 top-0 bg-gradient-to-b from-accent to-transparent"
              initial={{ height: "0%" }}
              animate={inView && index < 2 ? { height: "100%" } : { height: "0%" }}
              transition={{
                duration: reducedMotion ? 0 : 0.5,
                delay: reducedMotion ? 0 : index * 0.12 + 0.3,
                ease: [0.25, 1, 0.5, 1],
              }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Stage content */}
      <motion.div
        className={cn(
          "mb-4 flex-1 overflow-hidden rounded-xl border p-4",
          isFeatured
            ? "border-accent/30 bg-surface/60"
            : "border-border/60 bg-surface/25"
        )}
        initial={{ opacity: 0, x: reducedMotion ? 0 : 16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.09 + 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top accent line on featured */}
        {isFeatured && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"
          />
        )}

        <div className="flex items-center justify-between">
          <h3
            className={cn(
              "text-sm font-semibold",
              isFeatured ? "text-text-primary" : "text-text-secondary"
            )}
          >
            {stage.name}
          </h3>
          {isFeatured && (
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={reducedMotion ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            />
          )}
        </div>

        <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
          {stage.shortDescription}
        </p>

        <p
          className={cn(
            "mt-2 font-mono text-[9px]",
            isFeatured ? "text-accent/70" : "text-text-tertiary"
          )}
        >
          {isFeatured ? `[~] ${stage.statusLabel}` : `[✓] ${stage.statusLabel}`}
        </p>
      </motion.div>
    </div>
  );
}

// ─── SECTION ─────────────────────────────────────────────────────────────────

export function MethodTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const contentInView = useInView(sectionRef, { once: true, margin: "-60px" });

  if (methodStages.length === 0) return null;

  const sorted = [...methodStages].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border bg-bg-secondary px-4 py-20 sm:px-6 sm:py-24"
    >
      {/* Dot-grid continuation — same pattern, different opacity zone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      />

      {/* Ambient glow — single, right-side, subdued */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-20 right-[10%] h-[380px] w-[380px] rounded-full bg-accent opacity-[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Section header */}
        <div ref={headerRef} className="mb-14 sm:mb-16">
          <motion.p
            className="mb-3 font-mono text-xs tracking-widest text-accent sm:text-sm"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            How We Work
          </motion.p>

          <motion.h2
            className="max-w-2xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            A process built to{" "}
            <span className="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
              remove doubt.
            </span>
          </motion.h2>

          <motion.p
            className="mt-4 max-w-lg text-sm text-text-secondary sm:text-base"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            Five stages. No surprises. Every deliverable defined before
            a single line gets written.
          </motion.p>
        </div>

        {/* ── DESKTOP PIPELINE (lg+) ────────────────────────────── */}
        <div className="relative hidden lg:flex lg:items-start lg:gap-2">
          {sorted.map((stage, index) => (
            <StageNode
              key={stage.id}
              stage={stage}
              index={index}
              total={sorted.length}
              inView={contentInView}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* ── MOBILE PIPELINE (below lg) ────────────────────────── */}
        <div className="lg:hidden">
          {sorted.map((stage, index) => (
            <MobileStageRow
              key={stage.id}
              stage={stage}
              index={index}
              total={sorted.length}
              inView={contentInView}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0 }}
          animate={contentInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Build Complete badge */}
          <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
            <span className="text-success">✓</span>
            <span>Build Complete — every time.</span>
          </div>

          <Link
            href="/method"
            className="group inline-flex items-center gap-2 font-mono text-xs text-text-secondary transition-colors duration-300 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary sm:text-sm"
          >
            See the full process
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
