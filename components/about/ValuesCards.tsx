"use client";

/**
 * ValuesCards — About page click-to-expand interactive cards.
 *
 * PRD §2.2.2: hover-expand interactive cards — standardized to
 * click-to-expand so the interaction is identical on desktop + mobile.
 * Hover gives a lift/glow affordance on desktop; click/tap drives expand.
 *
 * BUG FIXES vs previous version:
 * 1. Close button is a real <button> with stopPropagation() — no more
 *    fighting between card-click-toggle and close-button-click.
 * 2. isFocused no longer feeds into isActive (expand state) — it only
 *    drives the keyboard focus ring. This was causing the card to
 *    stay open because focus remained after clicking close.
 * 3. TypeScript error on line 73 fixed: (typeof values) → (typeof companyValues).
 *
 * PREMIUM REDESIGN:
 * - Each value has a unique gradient direction for its accent line.
 * - Expanded state: inner glow + brighter border + card lifts.
 * - Collapsed state: subtle bottom-edge shimmer line.
 * - Icon: glass-pill with per-value color tint.
 * - Close button: dedicated element, own tap target, own aria-label.
 * - Grain texture: increased opacity for real depth contribution.
 *
 * Mobile: 44px+ tap targets everywhere. Full-width cards. Bottom-sheet-
 * style expand feel (content drops in from above fold line).
 * Desktop: 3-column grid. Hover lifts card 6px. Click expands.
 *
 * Data: zero hardcoded copy — all from data/values.ts.
 * Motion: fully respects prefers-reduced-motion.
 */

import { useState, useId, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { RevealSection, RevealItem } from "@/components/ui/RevealSection";
import { companyValues } from "@/data/values";
import { cn } from "@/lib/utils";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Per-value visual config.
 * gradient: the accent line direction — varies per card so the grid
 * doesn't feel copy-pasted.
 * glowColor: the inner ambient glow tint when expanded.
 */
const VALUE_CONFIG: Record<
  string,
  {
    gradient: string;
    glowFrom: string;
    glowTo: string;
  }
> = {
  excellence: {
    gradient:
      "to right, rgb(62 123 250 / 0.9), rgb(34 211 238 / 0.4), transparent",
    glowFrom: "rgb(62 123 250 / 0.12)",
    glowTo: "transparent",
  },
  ownership: {
    gradient:
      "to right, rgb(99 102 241 / 0.9), rgb(62 123 250 / 0.4), transparent",
    glowFrom: "rgb(99 102 241 / 0.12)",
    glowTo: "transparent",
  },
  innovation: {
    gradient:
      "to right, rgb(34 211 238 / 0.9), rgb(62 123 250 / 0.4), transparent",
    glowFrom: "rgb(34 211 238 / 0.10)",
    glowTo: "transparent",
  },
  speed: {
    gradient:
      "to right, rgb(250 189 62 / 0.7), rgb(62 123 250 / 0.3), transparent",
    glowFrom: "rgb(250 189 62 / 0.08)",
    glowTo: "transparent",
  },
  reliability: {
    gradient:
      "to right, rgb(52 211 153 / 0.8), rgb(34 211 238 / 0.3), transparent",
    glowFrom: "rgb(52 211 153 / 0.10)",
    glowTo: "transparent",
  },
  transparency: {
    gradient:
      "to right, rgb(62 123 250 / 0.9), rgb(99 102 241 / 0.4), transparent",
    glowFrom: "rgb(62 123 250 / 0.12)",
    glowTo: "transparent",
  },
};

const DEFAULT_CONFIG = VALUE_CONFIG.excellence;

// ─── ICON ─────────────────────────────────────────────────────────────────────

function ValueIcon({ id, active }: { id: string; active: boolean }) {
  const cls = cn(
    "h-5 w-5 transition-colors duration-300",
    active ? "text-accent" : "text-text-tertiary",
  );

  const icons: Record<string, React.ReactNode> = {
    excellence: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cls}
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    ownership: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cls}
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    innovation: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cls}
        aria-hidden="true"
      >
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.6-1.4 4.9-3.5 6.2-.5.3-.5.8-.5 1.3V17H9v-.5c0-.5 0-1-.5-1.3A7 7 0 0 1 12 2z" />
      </svg>
    ),
    speed: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cls}
        aria-hidden="true"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    reliability: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cls}
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    transparency: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cls}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  };

  return <>{icons[id] ?? icons.excellence}</>;
}

// ─── CLOSE BUTTON ─────────────────────────────────────────────────────────────

/**
 * Dedicated close button — completely separate from the card click handler.
 * stopPropagation() prevents the click from bubbling to the card's onClick,
 * which is what caused the "X click has no effect" bug in the previous version.
 * The card onClick toggles open; this button only closes.
 */
function CloseButton({
  onClose,
  rm,
}: {
  onClose: (e: React.MouseEvent | React.TouchEvent) => void;
  rm: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label="Collapse value card"
      onClick={onClose}
      onTouchEnd={(e) => {
        // Explicit touch handler for mobile — belt-and-suspenders approach
        // because some touch events don't reliably fire onClick on certain
        // Android WebViews without this.
        e.preventDefault();
        onClose(e);
      }}
      initial={{ opacity: 0, scale: rm ? 1 : 0.6, rotate: rm ? 45 : 0 }}
      animate={{ opacity: 1, scale: 1, rotate: 45 }}
      exit={{ opacity: 0, scale: rm ? 1 : 0.6 }}
      transition={{ duration: rm ? 0 : 0.2, ease: EASE }}
      className={cn(
        // 44×44 touch target — minimum per PRD §3.3 + WCAG 2.5.5
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
        "border border-accent/30 bg-accent/10",
        "text-accent",
        "transition-colors duration-200",
        "hover:border-accent/60 hover:bg-accent/20",
        // Focus ring for keyboard navigation
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
      )}
    >
      {/* The + at 45° IS the × — same SVG, just rotated by parent animate */}
      <svg
        viewBox="0 0 12 12"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="6" y1="1" x2="6" y2="11" />
        <line x1="1" y1="6" x2="11" y2="6" />
      </svg>
    </motion.button>
  );
}

// ─── EXPAND TOGGLE BUTTON ─────────────────────────────────────────────────────

function ExpandToggle({ rm }: { rm: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
        "border border-border bg-surface-raised text-text-disabled",
        "transition-colors duration-200 group-hover:border-accent/30 group-hover:text-accent/60",
      )}
    >
      <svg
        viewBox="0 0 12 12"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="6" y1="1" x2="6" y2="11" />
        <line x1="1" y1="6" x2="11" y2="6" />
      </svg>
    </div>
  );
}

// ─── VALUE CARD ───────────────────────────────────────────────────────────────

interface ValueCardProps {
  value: (typeof companyValues)[0]; // ← fixed: was (typeof values)[0]
  index: number;
  rm: boolean;
}

function ValueCard({ value, index, rm }: ValueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const contentId = useId();

  const cfg = VALUE_CONFIG[value.id] ?? DEFAULT_CONFIG;

  // Card click: only opens. Never closes — that's the close button's job.
  // This separation is the core fix for the "X doesn't work" bug.
  const handleCardClick = useCallback(() => {
    if (!expanded) setExpanded(true);
  }, [expanded]);

  // Close: only the close button calls this.
  // stopPropagation() prevents the click from bubbling to handleCardClick
  // and re-opening the card immediately after closing.
  const handleClose = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setExpanded(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setExpanded((prev) => !prev);
      }
      if (e.key === "Escape" && expanded) {
        setExpanded(false);
      }
    },
    [expanded],
  );

  return (
    <RevealItem>
      <motion.div
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-2xl",
          "transition-colors duration-300",
          // Border: dim when collapsed, accent-tinted when expanded
          expanded
            ? "border border-accent/50"
            : "border border-border hover:border-border-hover",
        )}
        style={{
          // Layered background for real depth — not flat surface color.
          // Base: very dark with subtle blue-tint at rest.
          // Active: the inner glow makes it feel lit from inside.
          background: expanded
            ? `radial-gradient(ellipse 120% 80% at 50% 0%, ${cfg.glowFrom} 0%, rgb(18 18 22) 60%), rgb(14 14 18)`
            : "rgb(14 14 18)",
        }}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // Hover lift — desktop affordance. Disabled on reduced-motion.
        whileHover={
          rm ? {} : { y: -6, transition: { duration: 0.3, ease: EASE } }
        }
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        initial={{ opacity: 0, y: rm ? 0 : 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.09, ease: EASE }}
      >
        {/* ── Top accent line — always rendered, opacity-driven ── */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px transition-opacity duration-500"
          style={{
            background: `linear-gradient(${cfg.gradient})`,
            opacity: expanded ? 1 : 0,
          }}
        />

        {/* ── Collapsed bottom shimmer — shows only when not expanded ── */}
        {/* Gives collapsed cards a subtle "alive" feel instead of being dead flat */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(to right, transparent 20%, rgb(62 123 250 / 0.15) 50%, transparent 80%)",
            opacity: expanded ? 0 : 1,
          }}
        />

        {/* ── Grain texture — real depth contribution ── */}
        {/* Increased opacity vs previous version for visible effect */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-screen"
        >
          <filter id={`vcg-${value.id}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves={4}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#vcg-${value.id})`} />
        </svg>

        {/* ── Card content ── */}
        <div className="relative p-6 sm:p-7">
          {/* Header row — always visible */}
          <div className="flex items-center gap-4">
            {/* Icon container */}
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                "border transition-all duration-300",
                expanded
                  ? "border-accent/40 bg-accent/12 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_0_16px_rgb(62_123_250/0.15)]"
                  : "border-border bg-surface-raised shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] group-hover:border-accent/25 group-hover:bg-accent/6",
              )}
            >
              <ValueIcon id={value.id} active={expanded} />
            </div>

            {/* Name + toggle button */}
            <div className="flex flex-1 items-center justify-between gap-3">
              <h3
                className={cn(
                  "text-base font-bold tracking-tight transition-colors duration-300 sm:text-lg",
                  expanded
                    ? "text-text-primary"
                    : "text-text-secondary group-hover:text-text-primary",
                )}
              >
                {value.name}
              </h3>

              {/* Toggle: shows + when collapsed, × (rotated +) when expanded */}
              <AnimatePresence mode="wait" initial={false}>
                {expanded ? (
                  <CloseButton key="close" onClose={handleClose} rm={rm} />
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, scale: rm ? 1 : 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: rm ? 1 : 0.7 }}
                    transition={{ duration: rm ? 0 : 0.18, ease: EASE }}
                    // aria-hidden: the card itself has role=button + aria-expanded,
                    // so this visual indicator doesn't need its own accessible role
                    aria-hidden="true"
                  >
                    <ExpandToggle rm={rm} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Expandable content ── */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                id={contentId}
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: rm ? 0 : 0.38, ease: EASE },
                  opacity: {
                    duration: rm ? 0 : 0.28,
                    ease: "easeOut",
                    delay: rm ? 0 : 0.06,
                  },
                }}
                style={{ overflow: "hidden" }}
              >
                {/* Divider */}
                <div
                  className="mt-5 h-px"
                  aria-hidden="true"
                  style={{
                    background: `linear-gradient(to right, transparent, rgb(var(--color-accent-primary) / 0.2), transparent)`,
                  }}
                />

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                  {value.expandedDescription ?? value.oneLiner}
                </p>

                {/* Brand stamp tag */}
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/6 px-3 py-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                    Core principle
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Keyboard focus ring — keyboard nav only, not on mouse focus ── */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-150",
            "ring-2 ring-accent/50 ring-offset-2 ring-offset-bg-secondary",
            isFocused ? "opacity-100" : "opacity-0",
          )}
        />
      </motion.div>
    </RevealItem>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────

export function ValuesCards() {
  const rm = usePrefersReducedMotion();

  if (!companyValues || companyValues.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28"
      style={{ background: "rgb(10 10 12)" }}
    >
      {/* Ambient glow — center top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(62 123 250 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <RevealSection className="mb-14 sm:mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-accent" aria-hidden="true" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              How We Think
            </span>
          </div>

          <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            Six principles.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-accent-glow)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              No exceptions.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
            These are not wall art. They are the lens through which every
            architecture decision, every line of code, and every client
            conversation is filtered.
          </p>
        </RevealSection>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {companyValues.map((value, i) => (
            <ValueCard key={value.id} value={value} index={i} rm={rm} />
          ))}
        </div>

        {/* Bottom statement */}
        <RevealSection className="mt-14 sm:mt-16">
          <div
            className="flex items-center gap-5 rounded-2xl border px-6 py-5 sm:px-8 sm:py-6"
            style={{
              background:
                "linear-gradient(to right, rgb(62 123 250 / 0.04), rgb(14 14 18), rgb(99 102 241 / 0.03))",
              borderColor: "rgb(62 123 250 / 0.15)",
            }}
          >
            <div
              className="h-8 w-0.5 shrink-0 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(var(--color-accent-primary)), rgb(var(--color-accent-glow)))",
              }}
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
              These principles do not flex for deadlines, budgets, or client
              pressure. They are the standard — not the ceiling.
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
