"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { companyValues } from "@/data/values";
import { usePrefersReducedMotion } from "@/lib/hooks";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Every value gets a large display number + a short keyword label
// that reads as a visual "stamp" — not a description, a declaration.
const VALUE_META: Record<string, {
  number: string;
  stamp: string;
  iconPath: string;
}> = {
  excellence:   {
    number: "01",
    stamp: "Standard,\nnot deadline.",
    iconPath: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
  ownership:    {
    number: "02",
    stamp: "Our name\non the line.",
    iconPath: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  innovation:   {
    number: "03",
    stamp: "Right way,\nnot easy way.",
    iconPath: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  },
  speed:        {
    number: "04",
    stamp: "Fast without\ncutting corners.",
    iconPath: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  reliability:  {
    number: "05",
    stamp: "Still running\nyears from now.",
    iconPath: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  transparency: {
    number: "06",
    stamp: "You always\nknow the status.",
    iconPath: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
};

// ─── VALUE CARD ───────────────────────────────────────────────────────────────

function ValueCard({
  value,
  index,
  rm,
}: {
  value: (typeof companyValues)[0];
  index: number;
  rm: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Each card fires independently on scroll — mobile cinema effect
  const inView = useInView(cardRef, { once: true, margin: "-30px" });
  const meta = VALUE_META[value.id] ?? VALUE_META.excellence;

  // Alternate cards: even ones come from left, odd from right
  // — creates a natural zigzag feel on mobile scroll
  const xOffset = rm ? 0 : index % 2 === 0 ? -24 : 24;

  return (
    <motion.div
      ref={cardRef}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: "rgb(15 15 17)",
        border: "1px solid rgb(var(--color-border))",
      }}
    >
      {/* Top accent line — draws on entry */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px origin-left"
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        style={{
          background:
            "linear-gradient(to right, rgb(62 123 250 / 0.8), rgb(34 211 238 / 0.3), transparent)",
        }}
      />

      {/* Ambient glow — top-left corner, always on, very subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(62 123 250 / 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex h-full flex-col p-5 sm:p-6">

        {/* Top row: large number + icon */}
        <div className="mb-4 flex items-start justify-between">
          {/* Giant ordinal — the hero visual element of each card */}
          <motion.span
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="font-mono font-bold leading-none"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 3.5rem)",
              // Gradient number — accent blue, medium opacity
              background:
                "linear-gradient(135deg, rgb(62 123 250 / 0.5) 0%, rgb(62 123 250 / 0.15) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {meta.number}
          </motion.span>

          {/* Icon — pops in with slight scale */}
          <motion.div
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "rgb(62 123 250 / 0.08)",
              border: "1px solid rgb(62 123 250 / 0.18)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="rgb(var(--color-accent-primary))"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={meta.iconPath} />
            </svg>
          </motion.div>
        </div>

        {/* Value name */}
        <motion.h3
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
          className="mb-2 text-lg font-bold tracking-tight text-text-primary sm:text-xl"
        >
          {value.name}
        </motion.h3>

        {/* Thin accent divider */}
        <motion.div
          className="mb-3 h-px w-8 origin-left rounded-full"
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
          style={{ background: "rgb(var(--color-accent-primary))" }}
        />

        {/* One-liner */}
        <motion.p
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
          className="flex-1 text-sm leading-relaxed text-text-secondary"
        >
          {value.oneLiner}
        </motion.p>

        {/* Stamp text — bottom right, large ghost text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-4 select-none text-right font-mono text-[10px] font-semibold uppercase leading-tight tracking-widest"
          style={{
            color: "rgb(62 123 250 / 0.12)",
            whiteSpace: "pre-line",
          }}
        >
          {meta.stamp}
        </div>
      </div>
    </motion.div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────

/**
 * Home "How We Operate" — Values Section (PRD §2.2.1).
 *
 * LAYOUT: Asymmetric bento grid.
 * - Mobile:  single column, full width cards
 * - Tablet:  2-column grid
 * - Desktop: 3-column grid
 *
 * MOBILE ANIMATION: each card has its own useInView — fires as the card
 * enters the viewport during scroll. Even cards slide from left, odd
 * cards from right — natural zigzag on phone scroll. Top accent line
 * draws left→right on entry. Icon pops with scale spring. Number fades.
 * One-liner fades last. Feels like the page is being built as you scroll.
 *
 * No EASE_SPRING passed to `ease` prop (that was the previous TypeError).
 * All transitions use the cubic-bezier EASE array or duration-only.
 */
export function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rm = usePrefersReducedMotion();
  const headerInView = useInView(sectionRef, { once: true, margin: "-60px" });

  if (companyValues.length === 0) return null;

  const sorted = [...companyValues].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border"
      style={{ background: "rgb(10 10 11)" }}
    >
      {/* Top-edge accent line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 15%, rgb(62 123 250 / 0.35) 50%, transparent 85%)",
        }}
      />

      {/* Ambient glow — center top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(62 123 250 / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-10 lg:py-24">

        {/* Header */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <motion.p
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: EASE }}
            className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent"
          >
            How We Operate
          </motion.p>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <motion.h2
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.07, ease: EASE }}
              className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
            >
              Six values.{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-accent-glow)) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Zero exceptions.
              </span>
            </motion.h2>

            <motion.p
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
              className="max-w-xs text-sm leading-relaxed text-text-tertiary lg:text-right"
            >
              Not aspirational posters on a wall. The actual rules every
              build is measured against — internally, every time.
            </motion.p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((value, i) => (
            <ValueCard
              key={value.id}
              value={value}
              index={i}
              rm={rm}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          className="mt-10 text-center text-xs leading-relaxed text-text-disabled sm:mt-12"
        >
          These six values are why clients stay, builds ship on time,
          and systems keep running long after handoff.
        </motion.p>

      </div>
    </section>
  );
}
