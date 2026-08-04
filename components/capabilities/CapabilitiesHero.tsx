"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

const PREVIEW_LINES = [
  { text: 'const agent = new HafynAgent({', color: 'rgb(250 250 250 / 0.82)' },
  { text: "  model: 'gpt-4o',",             color: 'rgb(34 211 238 / 0.9)' },
  { text: "  tools: [searchWeb, writeCode],",color: 'rgb(250 250 250 / 0.82)' },
  { text: '});',                             color: 'rgb(161 161 170 / 0.5)' },
  { text: '',                                color: '' },
  { text: "await agent.deploy({ env: 'production' });", color: 'rgb(62 123 250 / 1)' },
  { text: '// ✓ Agent live — 99.9% uptime SLA',        color: 'rgb(34 197 94 / 0.8)' },
];

export function CapabilitiesHero() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const reduced = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-bg-primary px-6 pb-16 pt-28 sm:pt-32"
      aria-labelledby="cap-hero-heading"
    >
      {/* Cycling ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={reduced ? { opacity: 0.7 } : {
          background: [
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgb(62 123 250 / 0.14) 0%, transparent 68%)",
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgb(34 211 238 / 0.11) 0%, transparent 68%)",
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgb(168 85 247 / 0.10) 0%, transparent 68%)",
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgb(34 197 94 / 0.09) 0%, transparent 68%)",
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgb(245 158 11 / 0.10) 0%, transparent 68%)",
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgb(62 123 250 / 0.14) 0%, transparent 68%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgb(var(--color-border)) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 0%, transparent 72%)",
          opacity: 0.45,
        }}
      />

      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.025]"
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center gap-0">

        {/* Badge */}
        <motion.div
          className="mb-8 inline-flex items-center gap-3 rounded-full px-5 py-2.5"
          style={{
            background: "rgb(var(--color-surface) / 0.55)",
            backdropFilter: "blur(14px)",
            boxShadow: "inset 0 0 0 1px rgb(var(--color-border) / 0.8), 0 0 28px rgb(62 123 250 / 0.1)",
          }}
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE_OUT_QUART }}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" style={{ animationDuration: "1.6s" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
            The Build Console
          </span>
          <span className="font-mono text-[10px] text-text-disabled" aria-hidden="true">// 5 sequences</span>
        </motion.div>

        {/* Headline */}
        <h1
          id="cap-hero-heading"
          className="font-bold tracking-tight text-text-primary"
          style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.75rem)", lineHeight: 1.08 }}
        >
          {[
            { t: "We don't just",   g: false },
            { t: "write code.",     g: false },
            { t: "We deploy it.",   g: true  },
          ].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduced ? { y: 0, opacity: 1 } : { y: "108%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={reduced
                  ? { duration: 0.01 }
                  : { duration: 0.82, delay: 0.28 + i * 0.11, ease: EASE_OUT_EXPO }
                }
              >
                {line.g ? (
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))" }}
                  >
                    {line.t}
                  </span>
                ) : line.t}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          className="mx-auto mt-7 max-w-md text-base leading-relaxed text-text-secondary sm:text-lg"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.65, ease: EASE_OUT_QUART }}
        >
          Five disciplines. One engineering standard. Scroll to watch raw
          code compile into live, running software.
        </motion.p>

        {/* Live terminal preview */}
        <motion.div
          className="mt-12 w-full max-w-lg overflow-hidden rounded-2xl border bg-bg-primary"
          style={{
            borderColor: "rgb(62 123 250 / 0.22)",
            boxShadow: "0 0 0 1px rgb(62 123 250 / 0.06), 0 24px 60px rgb(0 0 0 / 0.55), 0 0 80px rgb(62 123 250 / 0.08)",
          }}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease: EASE_OUT_EXPO }}
        >
          {/* Chrome bar */}
          <div
            className="flex items-center gap-2 border-b px-4 py-3"
            style={{ borderColor: "rgb(62 123 250 / 0.15)", background: "rgb(62 123 250 / 0.04)" }}
          >
            <span className="h-3 w-3 rounded-full bg-error/70" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-warning/70" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-success/70" aria-hidden="true" />
            <span className="ml-3 font-mono text-xs text-text-secondary">agent.ts</span>
            <div className="ml-auto flex items-center gap-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                animate={reduced ? {} : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] text-text-secondary">compiling</span>
            </div>
          </div>

          {/* Code lines */}
          <div className="px-5 py-4 font-mono text-sm leading-[1.8]">
            {PREVIEW_LINES.map((line, i) => (
              <motion.div
                key={i}
                className={line.text === "" ? "h-[1.8em]" : "whitespace-pre"}
                style={{ color: line.color || undefined }}
                initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.9 + i * 0.07, ease: EASE_OUT_QUART }}
              >
                {line.text || undefined}
              </motion.div>
            ))}

            {/* Blinking cursor on last line */}
            <div className="flex items-center gap-0 font-mono text-sm" aria-hidden="true">
              <motion.span
                className="inline-block w-[2px] h-[1em] rounded-sm bg-accent"
                animate={reduced ? {} : { opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 1] }}
              />
            </div>
          </div>

          {/* Status bar */}
          <div
            className="flex items-center gap-3 border-t px-5 py-2.5"
            style={{ borderColor: "rgb(62 123 250 / 0.15)", background: "rgb(62 123 250 / 0.03)" }}
          >
            <span className="text-success font-mono text-[11px]">[✓]</span>
            <span className="font-mono text-[11px] text-text-secondary">Agent live — 99.9% uptime SLA</span>
            <span className="ml-auto font-mono text-[10px] text-text-secondary">Scroll to compile ↓</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
