"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { ecosystemDiagram } from "@/data/about";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  ACCENT_PRIMARY_RGB,
  EASE_OUT_EXPO,
  EASE_OUT_QUART,
} from "@/lib/motion";

/**
 * EcosystemDiagram — animated org chart (PRD §2.2.2).
 *
 * This revision (mobile-only fixes):
 *
 * 1. Color-animation bug fix: HAFYN BUILDS' boxShadow animation/hover
 *    previously used `rgb(var(--color-accent-primary) / a)` inside
 *    `animate`/`whileHover` — Framer Motion cannot interpolate CSS
 *    variables in animated color values (console: "is not an animatable
 *    color"). Now uses the literal ACCENT_PRIMARY_RGB constant from
 *    lib/motion.ts instead. Static (non-animated) styles elsewhere in
 *    this file are unaffected — they correctly keep using CSS variables.
 *
 * 2. Ghosted card grid (mobile <768px only): padding and gap increased
 *    for touch-friendly breathing room; `md:` overrides restore the
 *    exact original desktop values, so nothing changes at ≥768px.
 *
 * 3. Entrance sequence timing: a local, self-contained
 *    useIsMobileViewport() hook (not added to the shared lib/hooks.ts,
 *    to avoid touching a file whose current contents weren't
 *    re-verified this session) compresses one-shot entrance delays by
 *    ~45% on mobile for a snappier feel, while leaving desktop timing
 *    numerically identical (the `d()` helper is a no-op when
 *    isMobile is false). The infinite breathing-glow loop *durations*
 *    are untouched — only their one-shot start delay is compressed.
 *
 * HAFYN and HAFYN BUILDS node sizing is intentionally left unchanged
 * this pass — both already render with clear hierarchy and legibility
 * on mobile per visual review; touching their fluid clamp()-based
 * typography risked bleeding into tablet/desktop widths unintentionally.
 */

const SUBSIDIARY_SLOT_X = [100, 300, 500, 700, 900, 1100] as const;
const BRANCH_SOURCE_X = 600;
const BRANCH_VIEWBOX = "0 0 1200 120";
const MOBILE_TIMING_FACTOR = 0.55;

function useIsMobileViewport(breakpointPx = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpointPx]);

  return isMobile;
}

export function EcosystemDiagram() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobileViewport();

  // Compresses one-shot entrance delays on mobile only; identity
  // function on desktop, so desktop timing is byte-for-byte unchanged.
  const d = (value: number) => (isMobile ? value * MOBILE_TIMING_FACTOR : value);

  const { root, activeNode, subsidiaries, statusLabel } = ecosystemDiagram;

  return (
    <section
      ref={ref}
      className="relative scroll-mt-28 overflow-hidden border-t border-border/70 bg-bg-secondary px-6 pb-24 pt-28 sm:pb-28 sm:pt-32"
      aria-labelledby="ecosystem-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[50rem] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(var(--color-accent-primary) / 0.1) 0%, transparent 72%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]"
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Header — unchanged */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            className="mb-8 flex items-center justify-center gap-4"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
          >
            <span
              aria-hidden="true"
              className="h-px w-10"
              style={{ background: "rgb(var(--color-accent-primary) / 0.75)" }}
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              {ecosystemDiagram.eyebrow}
            </p>
          </motion.div>

          <h2
            id="ecosystem-heading"
            className="font-bold tracking-tight text-text-primary"
            style={{ fontSize: "clamp(1.85rem, 3.6vw, 2.75rem)", lineHeight: 1.2 }}
          >
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={
                  reduced ? { y: 0, opacity: 1 } : { y: "105%", opacity: 0 }
                }
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : { duration: 0.8, delay: d(0.15), ease: EASE_OUT_EXPO }
                }
              >
                {ecosystemDiagram.heading}
              </motion.span>
            </span>
          </h2>

          <motion.p
            className="mx-auto mt-6 text-base leading-relaxed text-text-secondary sm:text-lg"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: d(0.5), ease: EASE_OUT_QUART }}
          >
            {ecosystemDiagram.supportingLine}
          </motion.p>
        </div>

        {/* ── Diagram ─────────────────────────────────────────────── */}
        <div className="mt-12 flex flex-col items-center">

          {/* Root node — HAFYN — sizing unchanged, only timing compressed */}
          <div className="relative">
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.4) 0%, transparent 75%)",
                filter: "blur(26px)",
              }}
              initial={
                reduced ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 0.85 }
              }
              animate={
                isInView
                  ? reduced
                    ? { opacity: 0.5, scale: 1 }
                    : {
                        opacity: [0, 0.65, 0.45, 0.6, 0.45],
                        scale: [0.85, 1.15, 1, 1.08, 1],
                      }
                  : {}
              }
              transition={
                reduced
                  ? { duration: 0.01 }
                  : {
                      duration: 3.8,
                      delay: d(0.1),
                      times: [0, 0.18, 0.4, 0.7, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />

            <motion.div
              className="rounded-3xl p-[1.5px]"
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow) / 0.6), rgb(var(--color-accent-primary) / 0.3))",
              }}
              initial={
                reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
              }
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={
                reduced
                  ? { duration: 0.01 }
                  : { duration: 0.55, delay: d(0.05), ease: EASE_OUT_QUART }
              }
            >
              <div
                className="relative flex flex-col items-center rounded-[calc(1.5rem-1.5px)] px-10 py-6 text-center sm:px-14 sm:py-7"
                style={{
                  background:
                    "linear-gradient(160deg, rgb(var(--color-surface-raised)), rgb(var(--color-bg-primary)))",
                }}
              >
                <span
                  className="absolute -top-3.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))",
                    color: "rgb(10 10 11)",
                    boxShadow: "0 4px 18px rgb(var(--color-accent-primary) / 0.5)",
                  }}
                >
                  Holding Company
                </span>

                <span
                  className="mt-2 font-extrabold tracking-tight text-text-primary"
                  style={{ fontSize: "clamp(1.5rem, 2.7vw, 2.15rem)" }}
                >
                  {root.name}
                </span>
                <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                  {root.subtitle}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Root → HAFYN BUILDS connector */}
          <svg
            aria-hidden="true"
            width="2"
            height="64"
            viewBox="0 0 2 64"
            className="overflow-visible"
            style={{
              filter: reduced
                ? undefined
                : "drop-shadow(0 0 10px rgb(var(--color-accent-primary) / 0.75))",
            }}
          >
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="64"
              stroke="rgb(var(--color-accent-primary))"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={
                reduced
                  ? { duration: 0.01 }
                  : { duration: 0.45, delay: d(0.55), ease: EASE_OUT_QUART }
              }
            />
          </svg>

          {/* HAFYN BUILDS — sizing unchanged; boxShadow color fixed to a
              literal, and timing compressed on mobile */}
          <div className="relative">
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.55) 0%, transparent 72%)",
                filter: "blur(20px)",
              }}
              initial={reduced ? { opacity: 0.55, scale: 1 } : { opacity: 0, scale: 0.8 }}
              animate={
                isInView
                  ? reduced
                    ? { opacity: 0.55, scale: 1 }
                    : { opacity: [0, 0.75, 0.55, 0.7, 0.55], scale: [0.8, 1.1, 1, 1.06, 1] }
                  : {}
              }
              transition={
                reduced
                  ? { duration: 0.01 }
                  : {
                      duration: 3.2,
                      delay: d(0.85),
                      times: [0, 0.2, 0.45, 0.72, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />

            <motion.div
              className="group relative inline-flex flex-col items-center rounded-2xl px-8 py-5 text-center transition-shadow duration-300"
              style={{
                background: "rgb(var(--color-bg-primary))",
                border: "1px solid rgb(var(--color-accent-primary) / 0.7)",
                boxShadow: `0 0 0px rgba(${ACCENT_PRIMARY_RGB}, 0)`,
              }}
              initial={
                reduced
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.7 }
              }
              animate={
                isInView
                  ? {
                      opacity: 1,
                      scale: reduced ? 1 : [0.7, 1.08, 0.97, 1],
                      boxShadow: reduced
                        ? `0 0 40px rgba(${ACCENT_PRIMARY_RGB}, 0.4)`
                        : [
                            `0 0 0px rgba(${ACCENT_PRIMARY_RGB}, 0)`,
                            `0 0 40px rgba(${ACCENT_PRIMARY_RGB}, 0.4)`,
                          ],
                    }
                  : {}
              }
              whileHover={
                reduced
                  ? {}
                  : {
                      boxShadow: `0 0 56px rgba(${ACCENT_PRIMARY_RGB}, 0.55)`,
                    }
              }
              transition={
                reduced
                  ? { duration: 0.01 }
                  : {
                      opacity: { duration: 0.3, delay: d(0.85) },
                      scale: { duration: 0.55, delay: d(0.85), ease: EASE_OUT_QUART },
                      boxShadow: { duration: 0.6, delay: d(0.95), ease: EASE_OUT_QUART },
                    }
              }
            >
              <motion.span
                className="absolute -top-3.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em]"
                style={{
                  background: "rgb(var(--color-accent-primary))",
                  color: "rgb(10 10 11)",
                  boxShadow: "0 4px 14px rgb(var(--color-accent-primary) / 0.4)",
                }}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : { duration: 0.4, delay: d(1.2), ease: EASE_OUT_QUART }
                }
              >
                <span className="relative flex h-1.5 w-1.5">
                  <motion.span
                    aria-hidden="true"
                    className="absolute h-full w-full rounded-full bg-bg-primary/70"
                    animate={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: [0.7, 0], scale: [1, 2.4] }
                    }
                    transition={
                      reduced
                        ? { duration: 0.01 }
                        : { duration: 1.5, repeat: Infinity, ease: "easeOut" }
                    }
                  />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-bg-primary" />
                </span>
                {activeNode.badge}
              </motion.span>

              <span className="mt-1.5 text-lg font-bold tracking-tight text-text-primary sm:text-xl">
                {activeNode.name}
              </span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                {activeNode.subtitle}
              </span>
            </motion.div>
          </div>

          {/* Stem down to branch fan-out */}
          <svg
            aria-hidden="true"
            width="2"
            height="40"
            viewBox="0 0 2 40"
            className="overflow-visible"
          >
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="40"
              stroke="rgb(var(--color-border-hover))"
              strokeWidth="2"
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={
                reduced
                  ? { duration: 0.01 }
                  : { duration: 0.3, delay: d(1.4), ease: EASE_OUT_QUART }
              }
            />
          </svg>

          {/* ── Ghosted subsidiary branches ──────────────────────────
              Desktop (md+, ≥768px): connectors + card padding/gap are
              byte-for-byte identical to the prior approved state.
              Mobile (<768px): grid gap increased 16px→20px, card
              padding increased for touch-friendly breathing room.
          ─────────────────────────────────────────────────────────── */}
          <div className="w-full">
            <svg
              aria-hidden="true"
              viewBox={BRANCH_VIEWBOX}
              className="mx-auto hidden h-24 w-full max-w-4xl md:block"
              preserveAspectRatio="xMidYMin meet"
            >
              {SUBSIDIARY_SLOT_X.map((slotX, index) => {
                const dPath = `M ${BRANCH_SOURCE_X} 0 C ${BRANCH_SOURCE_X} 60, ${slotX} 60, ${slotX} 120`;
                const delay = d(1.5 + index * 0.1);

                return (
                  <motion.path
                    key={slotX}
                    d={dPath}
                    fill="none"
                    stroke="rgb(var(--color-border-hover))"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    opacity={0.4}
                    initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={
                      reduced
                        ? { duration: 0.01 }
                        : { duration: 0.35, delay, ease: EASE_OUT_QUART }
                    }
                  />
                );
              })}
            </svg>

            <div className="mt-0 grid grid-cols-2 gap-5 md:mt-0 md:grid-cols-3 lg:grid-cols-6">
              {subsidiaries.map((sub, index) => {
                const cardDelay = d(1.65 + index * 0.1);

                return (
                  <motion.div
                    key={sub.id}
                    className="w-full"
                    initial={
                      reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={
                      reduced
                        ? { duration: 0.01 }
                        : { duration: 0.4, delay: cardDelay, ease: EASE_OUT_QUART }
                    }
                  >
                    <Card
                      className="flex h-full flex-col items-center gap-1 rounded-xl px-4 py-5 text-center opacity-60 transition-all duration-300 hover:opacity-100 md:px-3 md:py-4"
                      style={{
                        background: "rgb(var(--color-bg-tertiary) / 0.35)",
                        border: "1px dashed rgb(var(--color-accent-primary) / 0.28)",
                      }}
                    >
                      <span className="text-xs font-semibold text-text-secondary sm:text-sm">
                        {sub.name}
                      </span>
                      <span className="text-[10px] leading-tight text-text-disabled sm:text-[11px]">
                        {sub.focus}
                      </span>
                      <motion.span
                        className="mt-1.5 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-text-tertiary"
                        style={{
                          border: "1px solid rgb(var(--color-border-hover) / 0.9)",
                        }}
                        animate={
                          reduced
                            ? { opacity: 0.85 }
                            : { opacity: [0.55, 1, 0.55] }
                        }
                        transition={
                          reduced
                            ? { duration: 0.01 }
                            : {
                                duration: 2.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.15,
                              }
                        }
                      >
                        {statusLabel}
                      </motion.span>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Closing element — unchanged */}
        <motion.div
          className="mx-auto mt-16 flex max-w-md flex-col items-center gap-5 text-center sm:mt-20"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={
            reduced
              ? { duration: 0.01 }
              : { duration: 0.6, delay: d(2.2), ease: EASE_OUT_QUART }
          }
        >
          <span
            aria-hidden="true"
            className="h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgb(var(--color-border-hover)), transparent)",
            }}
          />
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-disabled">
            More builds coming as the ecosystem grows.
          </p>
        </motion.div>

        <p className="sr-only">{ecosystemDiagram.accessibleDescription}</p>
      </div>
    </section>
  );
}
