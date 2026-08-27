"use client";

import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const TIMELINE_ROWS = [
  {
    size: "Small Project",
    example: "Landing page, simple web app",
    duration: "2–4 weeks",
    accent: "62 123 250",
  },
  {
    size: "Medium Project",
    example: "SaaS MVP, automation system",
    duration: "4–10 weeks",
    accent: "168 85 247",
  },
  {
    size: "Large Project",
    example: "Enterprise software, AI platform",
    duration: "10–20 weeks",
    accent: "34 211 238",
  },
  {
    size: "Ongoing Engagement",
    example: "Product iteration, support retainer",
    duration: "Continuous",
    accent: "34 197 94",
  },
] as const;

/**
 * Timeline transparency section — gives buyers honest duration expectations
 * by project size. PRD §2.2.5 requirement.
 */
export function TimelineSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      className="mx-auto max-w-5xl px-5 py-20 sm:px-8 lg:px-12"
      aria-labelledby="timeline-heading"
    >
      <div className="mb-12 text-center">
        <p
          className="mb-3 font-mono text-xs uppercase tracking-widest"
          style={{ color: "rgb(var(--color-accent-primary))" }}
          aria-hidden="true"
        >
          Timeline Transparency
        </p>
        <h2
          id="timeline-heading"
          className="text-3xl font-bold text-text-primary sm:text-4xl"
        >
          Honest durations.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-text-secondary sm:text-base">
          Every project is different. These ranges reflect real delivery
          experience — not optimistic sales estimates.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgb(42 42 49)" }}>
        {/* Table header */}
        <div
          className="grid grid-cols-3 border-b px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-text-tertiary"
          style={{ borderColor: "rgb(42 42 49)", backgroundColor: "rgb(15 15 17)" }}
        >
          <span>Project Size</span>
          <span className="hidden sm:block">Example</span>
          <span className="text-right">Typical Duration</span>
        </div>

        {/* Rows */}
        {TIMELINE_ROWS.map((row, i) => (
          <motion.div
            key={row.size}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: EASE_OUT_EXPO, delay: i * 0.08 }
            }
            className="grid grid-cols-3 items-center border-b px-6 py-4 last:border-0 transition-colors hover:bg-white/[0.02]"
            style={{ borderColor: "rgb(42 42 49)" }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: `rgb(${row.accent})`, boxShadow: `0 0 8px rgb(${row.accent} / 0.5)` }}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-text-primary">{row.size}</span>
            </div>
            <span className="hidden text-sm text-text-secondary sm:block">{row.example}</span>
            <span
              className="text-right font-mono text-sm font-semibold"
              style={{ color: `rgb(${row.accent})` }}
            >
              {row.duration}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-text-tertiary">
        Duration starts from requirements lock, not first contact.
        Discovery phase precedes every timeline estimate.
      </p>
    </section>
  );
}
