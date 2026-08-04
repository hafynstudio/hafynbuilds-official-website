"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

// FIX (Phase 2, CONTENT-001 / TRUST-005): "100+ industries" contradicted
// the shipped catalog (20 with packages); "99.9% uptime SLA" was an
// unsupported operational guarantee. Replaced with truthful values.
const STATS = [
  { value: "5",     label: "Core disciplines" },
  { value: "20+",   label: "Industries served" },
  { value: "24/7",  label: "Monitoring" },
];

export function CapabilitiesFinalCTA() {
  const ref     = useRef<HTMLElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });
  const reduced = usePrefersReducedMotion();

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-24 sm:py-32" aria-labelledby="cap-cta-heading">
      {/* Breathing gradient */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0"
        animate={reduced ? { opacity: 0.8 } : {
          background: [
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgb(62 123 250 / 0.12) 0%, transparent 65%)",
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgb(34 211 238 / 0.09) 0%, transparent 65%)",
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgb(62 123 250 / 0.12) 0%, transparent 65%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

      {/* Top line */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgb(62 123 250 / 0.4), transparent)" }} />

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle, rgb(var(--color-border)) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 75%)", opacity: 0.4 }} />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">

        {/* Stats */}
        <motion.div className="mb-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE_OUT_QUART }}>
          {STATS.map((stat, i) => (
            <motion.div key={stat.label}
              className="flex items-center gap-2.5 rounded-full border px-4 py-2"
              style={{ borderColor: "rgb(var(--color-border) / 0.8)", background: "rgb(var(--color-surface) / 0.5)", backdropFilter: "blur(10px)" }}
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08, ease: EASE_OUT_EXPO }}>
              <span className="font-mono text-sm font-bold text-accent">{stat.value}</span>
              <span className="font-mono text-xs text-text-tertiary">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Headline */}
        <h2 id="cap-cta-heading" className="font-bold tracking-tight text-text-primary"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.1 }}>
          {["Ready to see what", "these capabilities cost", "for your business?"].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span className="block"
                initial={reduced ? { y: 0, opacity: 1 } : { y: "105%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={reduced ? { duration: 0.01 } : { duration: 0.75, delay: 0.1 + i * 0.1, ease: EASE_OUT_EXPO }}>
                {i === 1 ? (
                  <span className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))" }}>
                    {line}
                  </span>
                ) : line}
              </motion.span>
            </span>
          ))}
        </h2>

        {/* Subtext */}
        <motion.p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.42, ease: EASE_OUT_QUART }}>
          Industry-specific packages across 20+ industries. Fixed pricing.
          Zero ambiguity. Built for businesses that move fast.
        </motion.p>

        {/* CTAs */}
        <motion.div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55, ease: EASE_OUT_QUART }}>

          {/* PRIMARY — premium glass CTA */}
          <Link href="/investment" className="group relative overflow-hidden rounded-xl px-8 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            style={{
              background: "linear-gradient(135deg, rgb(62 123 250 / 0.15) 0%, rgb(34 211 238 / 0.08) 100%)",
              boxShadow: "0 0 0 1px rgb(62 123 250 / 0.4), 0 0 32px rgb(62 123 250 / 0.15), inset 0 1px 0 rgb(255 255 255 / 0.1)",
            }}>
            {/* Shimmer sweep on hover */}
            <motion.div aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ translateX: "-100%" }}
              whileHover={reduced ? {} : { translateX: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }} />
            {/* Button content */}
            <span className="relative flex items-center gap-3">
              {/* Live pulse dot */}
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60"
                  style={{ animationDuration: "1.8s" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-semibold text-white tracking-wide">Explore Investment</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
              </svg>
            </span>
          </Link>

          {/* SECONDARY — ghost */}
          <Link href="/contact"
            className="group inline-flex items-center gap-2 rounded-xl border border-border/60 px-7 py-4 font-medium text-text-secondary transition-all duration-300 hover:border-accent/30 hover:bg-accent/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            style={{ backdropFilter: "blur(8px)" }}>
            Start a Build
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p className="mt-8 font-mono text-[11px] text-text-disabled"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}>
          Engineering the Impossible. Building What Matters.
        </motion.p>
      </div>
    </section>
  );
}
