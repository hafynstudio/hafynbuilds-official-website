"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { Card } from "@/components/ui/Card";
import {
  RevealItem,
  RevealSection,
} from "@/components/ui/RevealSection";
import { originStory } from "@/data/about";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

/**
 * Per-step node color — progresses from accent-primary (start, Intent)
 * to accent-glow (end, Impact). This mirrors the blue→cyan progression
 * already used in AboutHero's corner brackets, keeping the "start to
 * finish" color logic consistent across the page.
 */
const NODE_COLORS = [
  "rgb(var(--color-accent-primary))",
  "rgb(var(--color-accent-primary) / 0.72)",
  "rgb(var(--color-accent-glow) / 0.72)",
  "rgb(var(--color-accent-glow))",
] as const;

/**
 * OriginStory — About page section two.
 *
 * The right-hand visual is a vertical numbered stepper (not a data chart):
 * a single smooth connecting line runs through four circular step nodes,
 * each paired with a label and description. This reads unambiguously as
 * "four sequential steps" rather than a metrics/performance graph.
 *
 * Height balancing: the grid uses default (stretch) alignment, so the
 * figure's Card is forced to the same height as the left narrative
 * column. Internally, the stepper uses `flex-1` + `justify-between`,
 * so the four steps distribute evenly across whatever height the card
 * ends up at — this self-balances regardless of how long the narrative
 * copy is, rather than guessing a fixed pixel height.
 *
 * Sticky positioning was deliberately removed: RevealSection/RevealItem
 * apply Framer Motion transforms to ancestor elements, and any ancestor
 * transform (even a resolved translate(0)) establishes a new containing
 * block that breaks `position: sticky` for descendants. Relying on grid
 * stretch instead is robust regardless of the animation tree above it.
 */
export function OriginStory() {
  const blueprintRef = useRef<HTMLElement>(null);
  const blueprintInView = useInView(blueprintRef, {
    once: true,
    margin: "-15%",
  });
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-t border-border/70 bg-bg-secondary py-28 sm:py-36 lg:py-40"
      aria-labelledby="origin-story-heading"
    >
      {/* Section-entry accent line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(var(--color-accent-primary) / 0.65), transparent)",
        }}
      />

      {/* Controlled ambient light keeps the section from becoming flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.12), transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* items-stretch (default) is required so the figure's Card
            naturally matches the narrative column's height — this is
            what eliminates the dead-space gap. */}
        <RevealSection className="grid gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-20">
          {/* Narrative — unchanged */}
          <div className="lg:col-span-5">
            <RevealItem>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-px w-10"
                  style={{
                    background: "rgb(var(--color-accent-primary) / 0.75)",
                  }}
                />

                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
                  {originStory.sectionLabel}
                </p>
              </div>
            </RevealItem>

            <RevealItem>
              <h2
                id="origin-story-heading"
                className="mt-7 max-w-xl font-bold tracking-tight text-text-primary"
                style={{
                  fontSize: "clamp(2.25rem, 4vw, 4rem)",
                  lineHeight: 1.08,
                }}
              >
                {originStory.heading}
              </h2>
            </RevealItem>

            <RevealItem>
              <blockquote className="relative mt-10 border-l border-accent/70 pl-6">
                <div
                  aria-hidden="true"
                  className="absolute -left-1 top-0 h-2 w-2 rounded-full"
                  style={{
                    background: "rgb(var(--color-accent-primary))",
                    boxShadow: "0 0 18px rgb(var(--color-accent-primary) / 0.6)",
                  }}
                />

                <p className="text-lg font-medium leading-relaxed text-text-primary sm:text-xl">
                  "{originStory.founderVoice}"
                </p>

                <footer className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
                  Zain Marwat · Founder
                </footer>
              </blockquote>
            </RevealItem>

            <div className="mt-10 space-y-6">
              {originStory.body.map((paragraph) => (
                <RevealItem key={paragraph}>
                  <p className="text-base leading-8 text-text-secondary">
                    {paragraph}
                  </p>
                </RevealItem>
              ))}
            </div>

            <RevealItem>
              <div className="mt-10 flex items-start gap-4 border-t border-border/70 pt-6">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background: "rgb(var(--color-accent-glow))",
                    boxShadow: "0 0 14px rgb(var(--color-accent-glow) / 0.45)",
                  }}
                />

                <p className="max-w-md text-sm font-medium leading-6 text-text-primary">
                  {originStory.principle}
                </p>
              </div>
            </RevealItem>
          </div>

          {/* Architectural build visual — vertical stepper */}
          <figure
            ref={blueprintRef}
            className="lg:col-span-7 lg:h-full"
            aria-labelledby="origin-blueprint-caption"
          >
            <Card
              noise
              className="relative flex h-full flex-col overflow-hidden border-border/80 bg-bg-primary/80 p-0 backdrop-blur-xl"
            >
              {/* Header */}
              <div className="relative z-10 flex items-center justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background: "rgb(var(--color-accent-primary))",
                      boxShadow: "0 0 16px rgb(var(--color-accent-primary) / 0.55)",
                    }}
                  />

                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary sm:text-[11px]">
                    {originStory.blueprint.projectLabel}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <motion.span
                      aria-hidden="true"
                      className="absolute h-full w-full rounded-full"
                      style={{ background: "rgb(var(--color-accent-glow) / 0.55)" }}
                      animate={
                        reduced
                          ? { opacity: 0 }
                          : { opacity: [0.6, 0], scale: [1, 2.1] }
                      }
                      transition={
                        reduced
                          ? { duration: 0.01 }
                          : { duration: 1.6, repeat: Infinity, ease: "easeOut" }
                      }
                    />
                    <span
                      className="relative h-2 w-2 rounded-full"
                      style={{ background: "rgb(var(--color-accent-glow))" }}
                    />
                  </span>

                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary sm:inline">
                    {originStory.blueprint.statusLabel}
                  </span>
                </div>
              </div>

              {/* Stepper body — flex-1 so it stretches to fill whatever
                  height the Card ends up at, keeping the four steps
                  evenly distributed regardless of column height. */}
              <div className="relative min-h-[26rem] flex-1 overflow-hidden px-5 pb-7 pt-8 sm:px-8">
                {/* Ambient inspection light — abstract motion only,
                    does not imply measurable data (kept from prior pass). */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-24"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgb(var(--color-accent-primary) / 0.05), transparent)",
                  }}
                  animate={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: [0, 1, 0], y: ["-120%", "560%"] }
                  }
                  transition={
                    reduced
                      ? { duration: 0.01 }
                      : {
                          duration: 7,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1,
                        }
                  }
                />

                <div className="relative flex h-full">
                  {/* Connector column — one smooth vertical line through
                      four numbered circular nodes, spaced with
                      justify-between so they align with their labels
                      and fill the full available height. */}
                  <div className="relative flex w-11 flex-none flex-col items-center sm:w-12">
                    {/* Static base line (always visible, low contrast) */}
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 top-5 bottom-5 w-px -translate-x-1/2 bg-border/50"
                    />

                    {/* Animated gradient line — grows top to bottom on
                        scroll-into-view. A single straight line is the
                        smooth connector requested in place of a jagged
                        data-line. */}
                    <motion.div
                      aria-hidden="true"
                      className="absolute left-1/2 top-5 bottom-5 w-px origin-top -translate-x-1/2"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))",
                      }}
                      initial={reduced ? false : { scaleY: 0, opacity: 0 }}
                      animate={
                        blueprintInView
                          ? { scaleY: 1, opacity: 1 }
                          : undefined
                      }
                      transition={
                        reduced
                          ? { duration: 0.01 }
                          : { duration: 1.1, delay: 0.2, ease: EASE_OUT_EXPO }
                      }
                    />

                    {/* Numbered nodes — DOM order is Intent → Architecture
                        → Execution → Impact, rendered top to bottom with
                        no reversal, matching the "01 → 04" reading order
                        the footer caption implies. */}
                    <div className="relative z-10 flex h-full flex-col justify-between py-5">
                      {originStory.blueprint.stages.map((stage, index) => (
                        <motion.div
                          key={stage.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[10px] font-semibold sm:h-9 sm:w-9 sm:text-[11px]"
                          style={{
                            borderColor: NODE_COLORS[index],
                            color: NODE_COLORS[index],
                            background: "rgb(var(--color-bg-primary))",
                          }}
                          initial={
                            reduced ? false : { scale: 0, opacity: 0 }
                          }
                          animate={
                            blueprintInView
                              ? { scale: 1, opacity: 1 }
                              : undefined
                          }
                          transition={
                            reduced
                              ? { duration: 0.01 }
                              : {
                                  duration: 0.45,
                                  delay: 0.35 + index * 0.18,
                                  ease: EASE_OUT_EXPO,
                                }
                          }
                        >
                          {stage.index}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Label column — same justify-between rhythm as the
                      node column so each label sits level with its node. */}
                  <div className="flex flex-1 flex-col justify-between py-5 pl-5 sm:pl-6">
                    {originStory.blueprint.stages.map((stage, index) => (
                      <motion.div
                        key={stage.id}
                        initial={
                          reduced ? false : { opacity: 0, x: 8 }
                        }
                        animate={
                          blueprintInView
                            ? { opacity: 1, x: 0 }
                            : undefined
                        }
                        transition={
                          reduced
                            ? { duration: 0.01 }
                            : {
                                duration: 0.5,
                                delay: 0.4 + index * 0.18,
                                ease: EASE_OUT_QUART,
                              }
                        }
                      >
                        <p className="text-sm font-semibold text-text-primary sm:text-base">
                          {stage.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-text-tertiary sm:text-sm">
                          {stage.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <motion.div
                className="relative z-10 flex items-center justify-center border-t border-border/70 px-5 py-4"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={
                  blueprintInView ? { opacity: 1, y: 0 } : undefined
                }
                transition={
                  reduced
                    ? { duration: 0.01 }
                    : { duration: 0.6, delay: 1.15, ease: EASE_OUT_QUART }
                }
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                  {originStory.blueprint.coreLabel}
                </p>
              </motion.div>
            </Card>

            <figcaption id="origin-blueprint-caption" className="sr-only">
              {originStory.blueprint.accessibleDescription}
            </figcaption>
          </figure>
        </RevealSection>
      </div>
    </section>
  );
}
