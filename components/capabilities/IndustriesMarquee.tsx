"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { INDUSTRY_CATEGORIES } from "@/data/industry-categories";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

/**
 * IndustriesMarquee v2 — premium rebuild.
 * Two-row marquee running in opposite directions.
 * Reduced-motion: static pill grid.
 */

function splitRows(items: readonly string[]): [string[], string[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

const EDGE_MASK = "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)";

export function IndustriesMarquee() {
  const ref     = useRef<HTMLElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-40px" });
  const reduced = usePrefersReducedMotion();
  const [row1, row2] = splitRows(INDUSTRY_CATEGORIES);

  if (reduced) {
    return (
      <section ref={ref} aria-label="Industries we serve" className="relative overflow-hidden border-t border-border bg-bg-primary px-6 py-14">
        <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.22em] text-text-tertiary">
          Trusted across 20+ industries
        </p>
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2.5">
          {INDUSTRY_CATEGORIES.map((cat) => (
            <span key={cat} className="rounded-full border border-border/60 bg-bg-secondary px-3 py-1.5 font-mono text-xs text-text-secondary">
              {cat}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-label="Industries we serve"
      className="relative overflow-hidden border-t border-border bg-bg-primary py-14 sm:py-16"
    >
      {/* Atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgb(62 123 250 / 0.04) 0%, transparent 70%)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgb(62 123 250 / 0.18), transparent)" }} />

      {/* Header */}
      <motion.div
        className="relative mb-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-text-disabled">Trusted across</p>
        <div className="flex items-baseline gap-2">
          <span className="bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
            style={{ backgroundImage: "linear-gradient(135deg, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))" }}>
            20+
          </span>
          <span className="text-xl font-semibold text-text-secondary sm:text-2xl">industries</span>
        </div>
        <p className="font-mono text-xs text-text-tertiary">Every legitimate business, served at the highest standard.</p>
      </motion.div>

      {/* Row 1 — left to right */}
      <motion.div
        className="relative mb-3 overflow-hidden"
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
      >
        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {row1.map((cat) => (
                <span key={cat} className="mx-1 flex items-center gap-3 whitespace-nowrap">
                  <span className="rounded-full border px-4 py-2 font-mono text-xs text-text-secondary transition-all duration-300 hover:border-accent/30 hover:bg-accent/5 hover:text-text-primary"
                    style={{ borderColor: "rgb(var(--color-border) / 0.7)", background: "rgb(var(--color-surface) / 0.3)" }}>
                    {cat}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-accent/30" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Row 2 — right to left */}
      <motion.div
        className="relative overflow-hidden"
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT_EXPO }}
      >
        <div className="flex w-max items-center hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          style={{ animation: "marquee var(--duration-marquee) linear infinite reverse" }}>
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {row2.map((cat) => (
                <span key={cat} className="mx-1 flex items-center gap-3 whitespace-nowrap">
                  <span className="rounded-full border px-4 py-2 font-mono text-xs text-text-secondary transition-all duration-300 hover:border-accent-glow/30 hover:bg-accent-glow/5 hover:text-text-primary"
                    style={{ borderColor: "rgb(var(--color-border) / 0.7)", background: "rgb(var(--color-surface) / 0.3)" }}>
                    {cat}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-accent-glow/25" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="relative mt-10 flex justify-center"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.5, ease: EASE_OUT_QUART }}
      >
        <Link href="/investment"
          className="group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-xs text-text-secondary transition-all duration-300 hover:border-accent/30 hover:bg-accent/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          style={{ borderColor: "rgb(var(--color-border) / 0.8)", background: "rgb(var(--color-surface) / 0.4)", backdropFilter: "blur(8px)" }}>
          See pricing by industry
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}

