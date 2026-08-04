"use client";

/**
 * FounderBridge — About page closing section (PRD §2.2.2).
 *
 * IMAGE CROP FIX v5 — ROOT CAUSE ADDRESSED:
 * Previous versions used a FIXED height (h-64/h-80/h-96) while width
 * came from the grid column. Photo is 1154x1363 (~0.847 aspect, tall
 * portrait). Fixed height boxes were much wider proportionally than
 * the photo, forcing object-cover to crop ~50%+ of the vertical frame
 * to fill the box width — no object-position value could fix a
 * fundamentally mismatched container shape.
 *
 * Fix: aspect-ratio: 4/5 (0.8) — nearly identical to the source photo's
 * real ratio (0.847). Height now scales proportionally with width at
 * every breakpoint, so cropping is minimal and consistent everywhere.
 * No more per-breakpoint height guessing.
 *
 * Also removed: scale-105/110 transform (was compounding the crop by
 * zooming an already-mismatched frame further).
 */

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/hooks";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CONTENT = {
  eyebrow: "The Person Behind the Build",
  statement: "Every system we build carries a name.",
  statementAccent: "Here is the person who put it there.",
  supportingLine:
    "HAFYN BUILDS is the product of a specific philosophy, a specific standard, and a specific founder. The About page tells you what the company is. The Founder page tells you why it exists the way it does.",
  cta: {
    label: "Meet Zain Marwat",
    href: "/founder",
  },
  founderName: "Zain Marwat",
  // FIX (Phase 2, TRUST-002): was "Founder, CEO & Architect of HAFYN" —
  // contradicted the authoritative title in data/founder.ts and the Person
  // schema ("Founder, Director & CEO"). Aligned to the authoritative one.
  founderTitle: "Founder, Director & CEO",
  founderPhoto: "/images/founder.jpg",
  founderInitials: "ZM",
} as const;

function PortraitCard({ inView, rm }: { inView: boolean; rm: boolean }) {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  // Minimal parallax — aspect-ratio box means no crop mismatch, so this
  // is purely a subtle "alive" effect, not compensating for anything.
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    rm ? ["0%", "0%"] : ["-1%", "1%"]
  );

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: rm ? 0 : 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgb(62 123 250 / 0.25) 0%, transparent 50%, rgb(34 211 238 / 0.12) 100%)",
          filter: "blur(1px)",
        }}
      />

      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(160deg, rgb(20 20 26) 0%, rgb(12 12 16) 100%)",
          border: "1px solid rgb(62 123 250 / 0.25)",
          boxShadow:
            "0 0 0 1px rgb(255 255 255 / 0.03), 0 24px 56px rgb(0 0 0 / 0.5), 0 0 60px rgb(62 123 250 / 0.07)",
        }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 z-10 h-px origin-left"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: rm ? 0 : 0.9, delay: 0.38, ease: EASE }}
          style={{
            background:
              "linear-gradient(to right, rgb(62 123 250 / 0.9), rgb(34 211 238 / 0.5), transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/*
          Portrait container — aspect-ratio matches the actual photo's
          real proportions (1154x1363 ≈ 0.847), so object-cover only
          needs to crop a tiny sliver, not half the frame.
        */}
        <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
          <motion.div style={{ y: imageY }} className="absolute inset-0">
            {!imgError ? (
              <Image
                src={CONTENT.founderPhoto}
                alt={`${CONTENT.founderName} — ${CONTENT.founderTitle}`}
                fill
                className="object-cover"
                style={{ objectPosition: "50% 22%" }}
                sizes="(min-width: 1024px) 45vw, 90vw"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: "rgb(18 18 24)" }}
              >
                <span
                  className="font-mono text-6xl font-bold"
                  style={{ color: "rgb(62 123 250 / 0.4)" }}
                >
                  {CONTENT.founderInitials}
                </span>
              </div>
            )}
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(to top, rgb(12 12 16) 0%, rgb(12 12 16 / 0.5) 60%, transparent 100%)",
            }}
          />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: rm ? 0 : 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.48, ease: EASE }}
            >
              <p className="text-lg font-bold tracking-tight text-white sm:text-xl">
                {CONTENT.founderName}
              </p>
              <p
                className="mt-0.5 text-xs font-medium tracking-wide"
                style={{ color: "rgb(34 211 238 / 0.85)" }}
              >
                {CONTENT.founderTitle}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div
            className="mb-4 h-px"
            style={{
              background:
                "linear-gradient(to right, rgb(62 123 250 / 0.25), transparent)",
            }}
            aria-hidden="true"
          />

          <p className="mb-5 text-sm leading-relaxed text-text-secondary">
            Founder. Architect. The person who set the standard every HAFYN
            BUILDS system is held to — read his philosophy in his own words.
          </p>

          <Link
            href={CONTENT.cta.href}
            className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 sm:w-auto"
            style={{
              background:
                "linear-gradient(135deg, rgb(62 123 250) 0%, rgb(41 182 246 / 0.9) 100%)",
              color: "rgb(255 255 255)",
              boxShadow:
                "0 0 0 1px rgb(62 123 250 / 0.4), 0 4px 20px rgb(62 123 250 / 0.3)",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full"
            />
            {CONTENT.cta.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function FounderBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const rm = usePrefersReducedMotion();
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "rgb(8 8 10)",
        borderTop: "1px solid rgb(255 255 255 / 0.05)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgb(62 123 250 / 0.06) 0%, transparent 65%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 select-none overflow-hidden"
      >
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 h-full w-full"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <linearGradient id="sfade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(62 123 250)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="rgb(62 123 250)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <rect x="0" y="44" width="40" height="36" fill="url(#sfade)" />
          <rect x="45" y="28" width="28" height="52" fill="url(#sfade)" />
          <rect x="78" y="48" width="48" height="32" fill="url(#sfade)" />
          <rect x="131" y="20" width="18" height="60" fill="url(#sfade)" />
          <rect x="154" y="40" width="58" height="40" fill="url(#sfade)" />
          <rect x="217" y="34" width="22" height="46" fill="url(#sfade)" />
          <rect x="310" y="36" width="52" height="44" fill="url(#sfade)" />
          <rect x="367" y="26" width="28" height="54" fill="url(#sfade)" />
          <rect x="470" y="18" width="18" height="62" fill="url(#sfade)" />
          <rect x="563" y="32" width="55" height="48" fill="url(#sfade)" />
          <rect x="660" y="24" width="47" height="56" fill="url(#sfade)" />
          <rect x="730" y="14" width="18" height="66" fill="url(#sfade)" />
          <rect x="810" y="26" width="28" height="54" fill="url(#sfade)" />
          <rect x="890" y="30" width="22" height="50" fill="url(#sfade)" />
          <rect x="980" y="18" width="47" height="62" fill="url(#sfade)" />
          <rect x="1050" y="22" width="32" height="58" fill="url(#sfade)" />
          <rect x="1144" y="30" width="42" height="50" fill="url(#sfade)" />
          <rect x="1247" y="14" width="13" height="66" fill="url(#sfade)" />
          <rect x="1355" y="20" width="48" height="60" fill="url(#sfade)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: rm ? 0 : 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-6 flex items-center gap-3"
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
                {CONTENT.eyebrow}
              </span>
            </motion.div>

            <div className="mb-6">
              <motion.h2
                initial={{ opacity: 0, y: rm ? 0 : 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.07, ease: EASE }}
                className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
              >
                {CONTENT.statement}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: rm ? 0 : 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
                className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-accent-glow)) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {CONTENT.statementAccent}
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
              className="mb-8 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base"
            >
              {CONTENT.supportingLine}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: rm ? 0 : 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
              className="flex flex-wrap gap-2.5"
            >
              {["Engineering excellence", "Founder-led builds", "Zero compromise"].map(
                (stamp) => (
                  <span
                    key={stamp}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{
                      background: "rgb(62 123 250 / 0.07)",
                      border: "1px solid rgb(62 123 250 / 0.18)",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "rgb(var(--color-accent-primary))" }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
                      style={{ color: "rgb(var(--color-accent-primary) / 0.85)" }}
                    >
                      {stamp}
                    </span>
                  </span>
                )
              )}
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.42, ease: EASE }}
              className="mt-10 h-px max-w-xs origin-left rounded-full"
              style={{
                background:
                  "linear-gradient(to right, rgb(62 123 250 / 0.5), transparent)",
              }}
              aria-hidden="true"
            />
          </div>

          <PortraitCard inView={inView} rm={rm} />
        </div>
      </div>
    </section>
  );
}
