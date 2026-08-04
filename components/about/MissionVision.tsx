"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Ban, Layers, ShieldCheck, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";
import {
  ecosystemPreview,
  missionPrinciples,
  statementSections,
} from "@/data/about";
import type { MissionPrinciple } from "@/types/about";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ACCENT_GLOW_RGB, EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

const PRINCIPLE_ICONS: Record<MissionPrinciple["icon"], LucideIcon> = {
  layers: Layers,
  shield: ShieldCheck,
  ban: Ban,
};

const mission = statementSections.find((s) => s.id === "mission")!;
const vision = statementSections.find((s) => s.id === "vision")!;

/**
 * MissionVision — two distinct full-bleed statement sections (PRD §2.2.2).
 *
 * This revision fixes a console bug traced here from the About page:
 * the Vision pill's `whileHover.borderColor`/`boxShadow` previously used
 * `rgb(var(--color-accent-glow) / a)`, which Framer Motion cannot parse
 * as an animatable color target (CSS variables aren't resolvable inside
 * JS-driven color interpolation — only in native/static CSS). Now uses
 * the literal ACCENT_GLOW_RGB constant from lib/motion.ts instead. The
 * pill's static `border`/`boxShadow` (its resting, non-hover state)
 * correctly continues to use CSS variables since those are never
 * passed through Framer's animate/whileHover interpolation.
 */

export function MissionVision() {
  return (
    <>
      <MissionSection />
      <VisionSection />
    </>
  );
}

function MissionSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border/70 bg-bg-secondary px-6 py-24 sm:py-28"
      aria-labelledby="mission-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.14) 0%, transparent 70%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]"
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <motion.div
            className="mb-8 flex items-center gap-4"
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
              {mission.eyebrow}
            </p>
          </motion.div>

          <h2
            id="mission-heading"
            className="font-bold tracking-tight text-text-primary"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)", lineHeight: 1.16 }}
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
                    : { duration: 0.85, delay: 0.15, ease: EASE_OUT_EXPO }
                }
              >
                {mission.statement}
              </motion.span>
            </span>
          </h2>

          <motion.p
            className="mt-7 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT_QUART }}
          >
            {mission.supportingLine}
          </motion.p>
        </div>

        <div className="lg:col-span-5">
          <Card
            noise
            className="border-border/80 bg-bg-primary/70 p-6 backdrop-blur-xl sm:p-7"
          >
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              What that means in practice
            </p>

            <ul className="space-y-4">
              {missionPrinciples.map((principle, index) => {
                const Icon = PRINCIPLE_ICONS[principle.icon];

                return (
                  <motion.li
                    key={principle.id}
                    className="flex items-center gap-4 border-t border-border/60 pt-4 first:border-t-0 first:pt-0"
                    initial={
                      reduced ? { opacity: 1 } : { opacity: 0, x: 12 }
                    }
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={
                      reduced
                        ? { duration: 0.01 }
                        : {
                            duration: 0.5,
                            delay: 0.55 + index * 0.12,
                            ease: EASE_OUT_QUART,
                          }
                    }
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: "rgb(var(--color-accent-primary) / 0.12)",
                      }}
                    >
                      <Icon
                        size={16}
                        strokeWidth={ICON_STROKE_WIDTH}
                        className="text-accent"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-sm font-medium text-text-primary sm:text-base">
                      {principle.label}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border/70 bg-bg-tertiary px-6 py-24 sm:py-28"
      aria-labelledby="vision-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[44rem] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(var(--color-accent-glow) / 0.13) 0%, transparent 72%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]"
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <motion.div
          className="mb-8 flex items-center justify-center gap-4"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
        >
          <span
            aria-hidden="true"
            className="h-px w-10"
            style={{ background: "rgb(var(--color-accent-glow) / 0.75)" }}
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-glow">
            {vision.eyebrow}
          </p>
          <span
            aria-hidden="true"
            className="h-px w-10"
            style={{ background: "rgb(var(--color-accent-glow) / 0.75)" }}
          />
        </motion.div>

        <h2
          id="vision-heading"
          className="font-bold tracking-tight text-text-primary"
          style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)", lineHeight: 1.16 }}
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
                  : { duration: 0.85, delay: 0.15, ease: EASE_OUT_EXPO }
              }
            >
              {vision.statement}
            </motion.span>
          </span>
        </h2>

        <motion.p
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT_QUART }}
        >
          {vision.supportingLine}
        </motion.p>

        <motion.div
          className="mt-16"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.85, ease: EASE_OUT_QUART }}
        >
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
            What&apos;s next in the ecosystem
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {ecosystemPreview.map((item, index) => (
              <motion.span
                key={item.id}
                className="group inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-medium text-text-primary transition-all duration-200 sm:text-[13px]"
                style={{
                  background: "rgb(var(--color-surface-raised) / 0.85)",
                  border: "1px solid rgb(var(--color-accent-primary) / 0.3)",
                  boxShadow:
                    "inset 0 1px 0 rgb(255 255 255 / 0.04), 0 2px 8px rgb(0 0 0 / 0.25)",
                }}
                initial={
                  reduced ? { opacity: 1 } : { opacity: 0, scale: 0.92 }
                }
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                whileHover={
                  reduced
                    ? {}
                    : {
                        scale: 1.04,
                        borderColor: `rgba(${ACCENT_GLOW_RGB}, 0.6)`,
                        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 0 20px rgba(${ACCENT_GLOW_RGB}, 0.2)`,
                      }
                }
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : {
                        duration: 0.4,
                        delay: 1.0 + index * 0.08,
                        ease: EASE_OUT_QUART,
                      }
                }
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200"
                  style={{
                    background: "rgb(var(--color-accent-glow) / 0.7)",
                  }}
                />
                {item.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
