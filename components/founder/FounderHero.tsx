"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { founder } from "@/data/founder";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import {
  HERO_WORD_STAGGER_S,
  HERO_WORD_TRANSITION,
} from "@/lib/motion";

// Real source photo is 1154x1363 -- aspectRatio mirrors it exactly per
// project convention (Decision D2): no fixed-height cropping box.
const PORTRAIT_ASPECT = "1154 / 1363";

// PRD 2.2.7: "Subtle parallax on portrait during scroll" -- kept small
// deliberately, this is a supporting detail, not a hero-scale effect.
const PARALLAX_RANGE_PX = 50;

/**
 * Full-presence Founder page hero. Portrait + name/title + opening
 * statement. Does NOT use the sitewide mask-wipe reveal pattern -- PRD
 * Section 3.2 explicitly scopes mask-wipe to About/Capabilities/Method/
 * Investment/Blog/Contact only. Instead reuses the Hero.tsx word-stagger
 * reveal (lib/motion.ts) for the name, matching the treatment already
 * established on Home's FounderTeaser strip that links into this page.
 */
export function FounderHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const rm = usePrefersReducedMotion();
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, rm ? 0 : PARALLAX_RANGE_PX]
  );

  const nameWords = founder.name.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border bg-bg-primary"
    >
      {/* Ambient radial glow -- portrait side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 65% at 15% 45%, rgb(62 123 250 / 0.08) 0%, transparent 65%)",
        }}
      />

      {/* Grain texture -- PRD 3.1, avoids flat/cheap dark background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.02] mix-blend-screen"
      >
        <filter id="founder-hero-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#founder-hero-noise)" />
      </svg>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-12 lg:py-28">
        {/* Portrait */}
        <motion.div
          style={{ y: portraitY }}
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[380px] lg:mx-0 lg:max-w-[460px]"
        >
          <div
            className="relative overflow-hidden rounded-xl border border-border shadow-glass-lg"
            style={{ aspectRatio: PORTRAIT_ASPECT }}
          >
            {founder.photoUrl && (
              <Image
                src={founder.photoUrl}
                alt={`${founder.name} -- ${founder.title}`}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 460px, (min-width: 640px) 85vw, 95vw"
                priority
                fetchPriority="high"
              />
            )}
            {/* Bottom gradient for text legibility if a caption is ever added */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background:
                  "linear-gradient(to top, rgba(5,5,8,0.7) 0%, transparent 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* Text content */}
        <div>
          <motion.div
            initial={false}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 flex items-center gap-2.5"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.17em] text-accent">
              {founder.eyebrow}
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
            <ArrowRight
              size={10}
              strokeWidth={ICON_STROKE_WIDTH}
              className="text-accent"
              aria-hidden="true"
            />
          </motion.div>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {nameWords.map((word, i) => (
              <motion.span
                key={i}
                className="mr-3 inline-block"
                initial={false}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  ...HERO_WORD_TRANSITION,
                  delay: i * HERO_WORD_STAGGER_S,
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={false}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 text-lg font-medium text-accent sm:text-xl"
          >
            {founder.title}
          </motion.p>

          <motion.p
            initial={false}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-[540px] text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            {founder.openingStatement}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
