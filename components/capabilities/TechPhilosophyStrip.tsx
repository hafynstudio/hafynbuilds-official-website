"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { techPhilosophy } from "@/data/tech-philosophy";
import { ICON_MAP, ICON_STROKE_WIDTH } from "@/lib/icons";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

/**
 * TechPhilosophyStrip v2 — premium rebuild.
 * Each card: layered glass surface, per-principle accent glow on hover,
 * animated icon container, staggered entrance from below.
 * Desktop: 6-column grid, each card reveals sequentially.
 * Mobile: 2-column grid, same entrance animations.
 */

// Per-principle accent colors for icon glow — cycles through capability palette
const PRINCIPLE_ACCENTS = [
  "62 123 250",   // Performance — blue
  "168 85 247",   // Security — purple
  "34 211 238",   // Scalability — cyan
  "245 158 11",   // Clean Arch — amber
  "62 123 250",   // AI — blue
  "34 197 94",    // Automation — green
];

export function TechPhilosophyStrip() {
  const ref     = useRef<HTMLElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-60px" });
  const reduced = usePrefersReducedMotion();

  if (techPhilosophy.length === 0) return null;

  const sorted = [...techPhilosophy].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section
      ref={ref}
      aria-labelledby="tech-philosophy-heading"
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24"
    >
      {/* Background atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgb(62 123 250 / 0.05) 0%, transparent 65%)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgb(62 123 250 / 0.2), transparent)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgb(var(--color-border) / 0.6), transparent)" }} />

      <div className="relative mx-auto max-w-7xl">

        {/* Section header */}
        <div className="mb-14 flex flex-col items-center text-center sm:mb-16">
          <motion.div
            className="mb-5 inline-flex items-center gap-2.5 rounded-full px-4 py-2"
            style={{ background: "rgb(var(--color-surface) / 0.5)", backdropFilter: "blur(10px)", boxShadow: "inset 0 0 0 1px rgb(var(--color-border) / 0.8)" }}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
          >
            <span className="relative flex h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">Engineering Philosophy</span>
          </motion.div>

          <motion.h2
            id="tech-philosophy-heading"
            className="text-2xl font-bold text-text-primary sm:text-3xl"
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE_OUT_EXPO }}
          >
            How we think before we build.
          </motion.h2>
          <motion.p
            className="mt-3 max-w-md text-sm text-text-secondary sm:text-base"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16, ease: EASE_OUT_QUART }}
          >
            Six non-negotiable principles woven into every line of code we ship.
          </motion.p>
        </div>

        {/* 6-card grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {sorted.map((principle, i) => {
            const Icon   = ICON_MAP[principle.icon];
            const accent = PRINCIPLE_ACCENTS[i] ?? "62 123 250";

            return (
              <motion.div
                key={principle.id}
                className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-bg-secondary p-5 text-center transition-all duration-500"
                style={{
                  borderColor: "rgb(var(--color-border) / 0.8)",
                  boxShadow: "var(--shadow-glass-sm)",
                }}
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.07, ease: EASE_OUT_EXPO }}
                whileHover={reduced ? {} : { y: -4, transition: { duration: 0.3, ease: EASE_OUT_QUART } }}
              >
                {/* Hover glow — top accent line */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ background: `linear-gradient(to right, transparent, rgb(${accent} / 0.7), transparent)` }}
                />

                {/* Hover glow — inner radial */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgb(${accent} / 0.08) 0%, transparent 65%)` }}
                />

                {/* Icon */}
                <motion.div
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-500"
                  style={{
                    borderColor: `rgb(${accent} / 0.25)`,
                    background: `rgb(${accent} / 0.1)`,
                  }}
                  whileHover={{
                    borderColor: `rgb(${accent} / 0.5)`,
                    background: `rgb(${accent} / 0.18)`,
                    boxShadow: `0 0 20px rgb(${accent} / 0.2)`,
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Icon glow dot */}
                  <div aria-hidden="true" className="absolute -top-px -right-px h-2 w-2 rounded-full border-2 border-bg-secondary"
                    style={{ backgroundColor: `rgb(${accent})` }} />
                  {Icon && (
                    <Icon
                      size={20}
                      strokeWidth={ICON_STROKE_WIDTH}
                      style={{ color: `rgb(${accent})` }}
                      aria-hidden="true"
                    />
                  )}
                </motion.div>

                {/* Text */}
                <div className="relative flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-text-primary leading-tight transition-colors duration-300 group-hover:text-white">
                    {principle.title}
                  </span>
                  <span className="text-[11px] leading-snug text-text-tertiary transition-colors duration-300 group-hover:text-text-secondary">
                    {principle.description}
                  </span>
                </div>

                {/* Bottom accent line — appears on hover */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[1px]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
                  style={{ background: `linear-gradient(to right, transparent, rgb(${accent} / 0.5), transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
