"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

interface ContactHeroProps {
  /** Human-readable reply window, e.g. "30 minutes". Threaded from the
   * page-level constant so this is never hardcoded. */
  replyWindow: string;
}

/**
 * ContactHero — mask-wipe opening statement.
 *
 * Mobile-first type scale: 375px devices used to break "you're building."
 * onto three awkward lines. New clamp anchors at 2.25rem (36px) minimum
 * with 9vw fluid growth, capping at 4.5rem (72px). Leading tightened to
 * 1.02 so the two lines feel like one impactful statement, not two.
 *
 * Vertical rhythm on mobile: pt-32 -> pt-28 (recover space eaten by
 * the fixed header), pb-16 (tighter than desktop pb-20). Desktop
 * spacing preserved via sm: modifiers.
 */
export function ContactHero({ replyWindow }: ContactHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const reduced = usePrefersReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: isInView
      ? { opacity: 1, y: 0 }
      : reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 16 },
    transition: { duration: 0.6, delay, ease: EASE_OUT_QUART },
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-border px-5 pb-8 pt-28 sm:px-6 sm:pb-20 sm:pt-32 md:px-12 lg:px-24"
      aria-labelledby="contact-hero-heading"
    >
      {/* Ambient glow — repositioned for portrait viewports so it doesn't
          get clipped off the top on tall narrow screens. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-10%] -translate-x-1/2 sm:top-0"
        style={{
          width: "min(90vw, 800px)",
          height: "min(70vh, 500px)",
          background:
            "radial-gradient(ellipse at center, rgb(var(--color-accent-primary) / 0.12) 0%, transparent 70%)",
        }}
        animate={reduced ? { opacity: 0.8 } : { opacity: [0.6, 1, 0.6] }}
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]"
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.p
          className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent sm:mb-6 sm:text-sm"
          {...fadeUp(0.05)}
        >
          Start a Build
        </motion.p>

        <h1
          id="contact-hero-heading"
          className="font-bold tracking-tight text-text-primary"
          style={{
            fontSize: "clamp(2.25rem, 9vw, 4.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
        >
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={reduced ? { y: 0, opacity: 1 } : { y: "105%", opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={
                reduced
                  ? { duration: 0.01 }
                  : { duration: 0.8, delay: 0.15, ease: EASE_OUT_EXPO }
              }
            >
              Tell us what
            </motion.span>
          </span>

          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={reduced ? { y: 0, opacity: 1 } : { y: "105%", opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={
                reduced
                  ? { duration: 0.01 }
                  : { duration: 0.8, delay: 0.32, ease: EASE_OUT_EXPO }
              }
            >
              you&apos;re{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))",
                }}
              >
                building.
              </span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg md:text-xl"
          {...fadeUp(0.65)}
        >
          Whether you have a fully-scoped brief or just a rough idea —
          we want to hear it. We reply within{" "}
          <span className="font-medium text-text-primary">{replyWindow}.</span>
        </motion.p>

        {/* Reply-time inline pill — mobile-only, sits under sub-copy as
            an ambient reassurance signal before user scrolls to form. */}
        <motion.div
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5 backdrop-blur-sm sm:hidden"
          {...fadeUp(0.8)}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="text-xs font-medium text-text-secondary">
            Replies in {replyWindow}
          </span>
        </motion.div>
      </div>
    </section>
  );
}