"use client";

/**
 * FounderSpotlight — Team page (PRD §2.2.3).
 *
 * DISTINCT from the regular team grid — larger footprint, cinematic
 * portrait treatment, unique surface, prominent CTA to /founder.
 * This is the "hero" of the Team page, not just card #1.
 *
 * Reuses:
 * - data/founder.ts (single source of truth for founder identity)
 * - components/ui/Button.tsx (magnetic + border-sweep — no reinvention)
 *
 * Layout:
 * - Mobile: portrait on top (visually anchors the page), content below
 * - Desktop: 5-column asymmetric split — 2 cols portrait, 3 cols content
 * - Portrait uses aspectRatio matching the real founder.jpg (~4/5) so
 *   the face frames correctly at every breakpoint (same fix as
 *   FounderBridge — one strategy, applied consistently)
 *
 * BUG-028 (Path B): the 10 fade-choreography elements below were
 * converted from inline initial/animate/transition object literals to
 * hoisted module-scope variants. Inline literals were recreated on
 * every re-render of this component — including the single render
 * where `inView` flips false->true and all 10 animations activate at
 * once. Variants let initial/animate become primitive string
 * references instead of freshly-allocated objects each render. Every
 * duration/delay/ease/offset value below is transcribed exactly from
 * the original inline definitions — no visual timing change. The
 * BUG-028 LCP fix (heading opacity 0->1) is preserved in
 * headingVariants.hidden.
 */

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { founder } from "@/data/founder";
import { usePrefersReducedMotion } from "@/lib/hooks";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const eyebrowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const eyebrowVariantsRM = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// headingVariants.hidden.opacity stays 1 — this is the BUG-028 LCP
// fix. Do not change this back to 0.
const headingVariants = {
  hidden: { opacity: 1, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.08, ease: EASE },
  },
};
const headingVariantsRM = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.08, ease: EASE },
  },
};

const portraitVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.16, ease: EASE },
  },
};
const portraitVariantsRM = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.16, ease: EASE },
  },
};

const accentLineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, delay: 0.4, ease: EASE } },
};

const tagVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.22, ease: EASE },
  },
};
const tagVariantsRM = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.22, ease: EASE },
  },
};

const nameVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3, ease: EASE },
  },
};
const nameVariantsRM = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3, ease: EASE },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.38, ease: EASE },
  },
};
const titleVariantsRM = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.38, ease: EASE },
  },
};

const dividerVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.44, ease: EASE },
  },
};

const blockquoteVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.5, ease: EASE },
  },
};
const blockquoteVariantsRM = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.5, ease: EASE },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.6, ease: EASE },
  },
};
const ctaVariantsRM = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.6, ease: EASE },
  },
};

export function FounderSpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const rm = usePrefersReducedMotion();
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [imgError, setImgError] = useState(false);

  // Subtle parallax on portrait — near-zero range so face never drifts
  // out of the aspect-locked crop (same discipline as FounderBridge v5).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    rm ? ["0%", "0%"] : ["-1%", "1%"]
  );

  const initials = founder.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "rgb(10 10 12)",
        borderTop: "1px solid rgb(255 255 255 / 0.05)",
      }}
    >
      {/* Ambient glow — top center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, rgb(62 123 250 / 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">

        {/* Eyebrow */}
        <motion.div
          variants={rm ? eyebrowVariantsRM : eyebrowVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-4 flex items-center gap-3"
        >
          <div
            className="h-px w-8 rounded-full"
            style={{ background: "rgb(var(--color-accent-primary))" }}
            aria-hidden="true"
          />
          <span
            className="font-mono text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "rgb(var(--color-accent-primary))" }}
          >
            Founder Spotlight
          </span>
        </motion.div>

        {/* Section heading — BUG-028 LCP fix preserved in headingVariants.hidden.opacity = 1 */}
        <motion.h1
          variants={rm ? headingVariantsRM : headingVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-14 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
        >
          The people who make{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-accent-glow)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            the standard.
          </span>
        </motion.h1>

        {/* Spotlight card */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:items-center lg:gap-12">

          {/* Portrait — 2 of 5 cols on desktop */}
          <motion.div
            variants={rm ? portraitVariantsRM : portraitVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative mx-auto w-full max-w-sm lg:col-span-2 lg:max-w-none"
          >
            {/* Outer glow ring */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgb(62 123 250 / 0.3) 0%, transparent 50%, rgb(34 211 238 / 0.15) 100%)",
                filter: "blur(1px)",
              }}
            />

            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background:
                  "linear-gradient(160deg, rgb(20 20 26) 0%, rgb(12 12 16) 100%)",
                border: "1px solid rgb(62 123 250 / 0.28)",
                boxShadow:
                  "0 0 0 1px rgb(255 255 255 / 0.03), 0 32px 64px rgb(0 0 0 / 0.5), 0 0 80px rgb(62 123 250 / 0.08)",
              }}
            >
              {/* Top accent line */}
              <motion.div
                className="absolute inset-x-0 top-0 z-10 h-px origin-left"
                variants={accentLineVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                style={{
                  background:
                    "linear-gradient(to right, rgb(62 123 250 / 0.9), rgb(34 211 238 / 0.5), transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* Portrait */}
              <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
                <motion.div style={{ y: imageY }} className="absolute inset-0">
                  {founder.photoUrl && !imgError ? (
                    <Image
                      src={founder.photoUrl}
                      alt={`${founder.name} — ${founder.title}`}
                      fill
                      className="object-cover"
                      style={{ objectPosition: "50% 22%" }}
                      sizes="(min-width: 1024px) 40vw, 80vw"
                      priority
                      fetchPriority="high"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={{ background: "rgb(18 18 24)" }}
                    >
                      <span
                        className="font-mono text-7xl font-bold"
                        style={{ color: "rgb(62 123 250 / 0.4)" }}
                      >
                        {initials}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Bottom fade */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(to top, rgb(12 12 16) 0%, rgb(12 12 16 / 0.5) 60%, transparent 100%)",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Content — 3 of 5 cols on desktop */}
          <div className="lg:col-span-3">

            {/* "The Founder" tag */}
            <motion.div
              variants={rm ? tagVariantsRM : tagVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                background: "rgb(62 123 250 / 0.08)",
                border: "1px solid rgb(62 123 250 / 0.22)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "rgb(var(--color-accent-primary))" }}
                aria-hidden="true"
              />
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "rgb(var(--color-accent-primary))" }}
              >
                The Founder
              </span>
            </motion.div>

            {/* Name */}
            <motion.h2
              variants={rm ? nameVariantsRM : nameVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              {founder.name}
            </motion.h2>

            {/* Title */}
            <motion.p
              variants={rm ? titleVariantsRM : titleVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-2 text-base font-semibold sm:text-lg"
              style={{ color: "rgb(34 211 238 / 0.9)" }}
            >
              {founder.title}
            </motion.p>

            {/* Divider */}
            <motion.div
              variants={dividerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-6 h-px max-w-xs origin-left rounded-full"
              style={{
                background:
                  "linear-gradient(to right, rgb(62 123 250 / 0.6), transparent)",
              }}
              aria-hidden="true"
            />

            {/* Tagline / pull quote */}
            <motion.blockquote
              variants={rm ? blockquoteVariantsRM : blockquoteVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="relative mt-6 max-w-xl"
            >
              {/* Decorative quote mark */}
              <span
                aria-hidden="true"
                className="absolute -left-2 -top-4 font-serif text-5xl leading-none opacity-40 sm:-left-3 sm:text-6xl"
                style={{ color: "rgb(var(--color-accent-primary))" }}
              >
                &ldquo;
              </span>
              <p className="pl-4 text-base italic leading-relaxed text-text-secondary sm:pl-6 sm:text-lg">
                {founder.tagline}
              </p>
            </motion.blockquote>

            {/* CTA */}
            <motion.div
              variants={rm ? ctaVariantsRM : ctaVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-8"
            >
              <Button href="/founder" variant="primary" size="lg">
                Meet the Founder
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}