"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { capabilities } from "@/data/capabilities";
import { ICON_MAP, ICON_STROKE_WIDTH } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Home Capabilities Teaser (PRD §2.2.1)
 *
 * AI Systems card: preserved exactly per explicit instruction.
 *
 * Secondary cards: miniature digital interfaces. Each activates its
 * micro-interactions via `active`, which is true when EITHER:
 *   (a) the user is hovering with a fine pointer (desktop), OR
 *   (b) the device has no real hover capability (touch) AND the card
 *       has scrolled into view.
 * This replaces the old hover-only model, which silently never
 * triggered on real touch devices and produced inconsistent-looking
 * "randomly active" cards in mobile emulation (whichever card happened
 * to sit under the emulator's synthetic cursor).
 *
 * COLOR-ANIMATION FIX: Framer Motion cannot interpolate colors that
 * contain a raw CSS var() reference (e.g. "rgb(var(--color-accent) / .5)")
 * — it needs a fully resolved color string to tween between two values.
 * All colors passed into an `animate={{ ... }}` object below are built
 * from the local TOKEN/rgba() helpers (plain numeric RGB), which
 * mirror styles/design-tokens.css exactly. Static (non-animated) colors
 * elsewhere in the file continue to use Tailwind's var()-backed classes
 * as normal — only values Framer Motion actively tweens needed this fix.
 */

// ─── RESOLVED COLOR TOKENS (mirrors styles/design-tokens.css) ───────────────
// Framer Motion's color interpolation requires concrete RGB values, not
// CSS custom properties — see file header comment. Keep these in sync
// with styles/design-tokens.css by hand; there are only 5 and they
// change extremely rarely (a full palette revision, not a routine edit).
const TOKEN = {
  accent: "62 123 250",
  accentGlow: "34 211 238",
  success: "34 197 94",
  white: "255 255 255",
} as const;

function rgba(triplet: string, alpha: number): string {
  return `rgb(${triplet} / ${alpha})`;
}

// ─── TOUCH / COARSE-POINTER DETECTION ────────────────────────────────────────
/**
 * Detects devices with no reliable hover (touch phones/tablets) so
 * secondary cards can self-activate on scroll-into-view instead of
 * silently never activating (hover events don't fire on touch at all).
 * Kept local to this file rather than added to lib/hooks.ts because the
 * current full contents of that shared file were not available to
 * safely merge into without risk of overwriting Phase 2/3 hooks — a
 * strong candidate to promote to lib/hooks.ts once that file's exact
 * contents are reconfirmed.
 */
function useCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: none), (pointer: coarse)");
    setIsCoarse(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isCoarse;
}

// ─── AI SYSTEMS CODE LINES (unchanged) ──────────────────────────────────────
const AI_CODE_LINES = [
  "const agent = new HafynAgent({",
  "  model: 'gpt-4o',",
  "  tools: [searchWeb, writeCode],",
  "  memory: PersistentMemory,",
  "});",
  "",
  "await agent.deploy({ env: 'production' });",
  "// ✓ Agent live — 99.9% uptime SLA",
];

// ─── MINIATURE INTERFACES ────────────────────────────────────────────────────
// Every prop is renamed `active` (not `hovered`) since it now reflects
// either a real hover OR an auto-triggered touch/scroll activation —
// `hovered` would be a misleading name for the touch-device case.

function WebAppInterface({ active }: { active: boolean; reducedMotion: boolean }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.07] bg-[#070910]"
      style={{ height: 148 }}>
      <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.025] px-3">
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" aria-hidden="true" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/14" aria-hidden="true" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/10" aria-hidden="true" />
        <div className="mx-2 flex h-3.5 flex-1 items-center rounded-sm border border-white/[0.06] bg-white/[0.03] px-2">
          <span className="h-1 w-16 rounded-full bg-white/10" aria-hidden="true" />
        </div>
      </div>
      <div className="flex h-[calc(100%-28px)]">
        <div className="flex w-10 flex-col gap-1.5 border-r border-white/[0.06] bg-white/[0.015] px-1.5 py-2">
          {[true, false, false, false].map((isActiveItem, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-sm"
              style={{ width: isActiveItem ? "100%" : "65%" }}
              animate={{
                backgroundColor: isActiveItem && active
                  ? rgba(TOKEN.accent, 0.7)
                  : isActiveItem
                  ? rgba(TOKEN.accent, 0.5)
                  : rgba(TOKEN.white, 0.1),
              }}
              transition={{ duration: 0.4 }}
              aria-hidden="true"
            />
          ))}
          <div className="mt-auto h-1.5 w-4 rounded-sm bg-white/[0.07]" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2">
          <motion.div
            className="h-8 w-full rounded-md border border-white/[0.06] bg-white/[0.03]"
            animate={{ y: active ? -1 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            aria-hidden="true"
          >
            <div className="flex h-full items-center gap-1.5 px-2">
              <div className="h-1.5 w-12 rounded-full bg-accent/40" />
              <div className="h-1.5 w-8 rounded-full bg-white/10" />
            </div>
          </motion.div>
          <div className="flex flex-1 gap-1.5">
            <motion.div
              className="flex-[2] rounded-md border border-white/[0.05] bg-white/[0.02] p-1.5"
              animate={{ y: active ? -1.5 : 0 }}
              transition={{ duration: 0.4, delay: 0.04, ease: [0.25, 1, 0.5, 1] }}
              aria-hidden="true"
            >
              <div className="mb-1 h-1 w-10 rounded-full bg-accent/30" />
              <div className="h-1 w-full rounded-full bg-white/[0.08]" />
              <div className="mt-0.5 h-1 w-3/4 rounded-full bg-white/[0.06]" />
            </motion.div>
            <motion.div
              className="flex-1 rounded-md border border-white/[0.05] bg-white/[0.02] p-1.5"
              animate={{ y: active ? -1 : 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
              aria-hidden="true"
            >
              <div className="mb-1 h-1 w-6 rounded-full bg-white/10" />
              <div className="h-1 w-full rounded-full bg-white/[0.07]" />
            </motion.div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 flex h-5 items-center gap-2 border-t border-white/[0.05] bg-white/[0.02] px-2"
      >
        <motion.span
          className="h-1 w-1 rounded-full"
          animate={{ backgroundColor: active ? rgba(TOKEN.success, 1) : rgba(TOKEN.success, 0.5) }}
          transition={{ duration: 0.3 }}
        />
        <span className="h-1 w-8 rounded-full bg-white/[0.07]" />
        <span className="ml-auto h-1 w-12 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}

function SaaSInterface({ active }: { active: boolean; reducedMotion: boolean }) {
  const pods = [
    { label: "Tenant A", isActivePod: true },
    { label: "Tenant B", isActivePod: false },
    { label: "Tenant C", isActivePod: false },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.07] bg-[#070910]"
      style={{ height: 148 }}>
      <div className="flex h-6 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-2.5">
        <span className="font-mono text-[8px] text-text-secondary">platform.hafyn.io</span>
        <motion.span
          className="flex items-center gap-1 font-mono text-[8px]"
          animate={{ color: active ? rgba(TOKEN.success, 1) : rgba(TOKEN.success, 0.8) }}
          transition={{ duration: 0.4 }}
        >
          <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
          running
        </motion.span>
      </div>

      <div className="flex gap-1.5 px-2 pt-2">
        {pods.map((pod, i) => (
          <motion.div
            key={i}
            className="flex-1 overflow-hidden rounded-md border bg-white/[0.025] p-1.5"
            animate={{
              y: active ? -2 : 0,
              borderColor: pod.isActivePod && active
                ? rgba(TOKEN.accent, 0.45)
                : pod.isActivePod
                ? rgba(TOKEN.accent, 0.25)
                : rgba(TOKEN.white, 0.05),
            }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 1, 0.5, 1] }}
            aria-hidden="true"
          >
            <div className="mb-1 flex items-center gap-1">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: pod.isActivePod
                    ? rgba(TOKEN.accent, 1)
                    : rgba(TOKEN.white, 0.15),
                }}
              />
              <span className="font-mono text-[7px] text-text-secondary">{pod.label}</span>
            </div>
            <div className="space-y-0.5">
              <div className="h-1 w-full rounded-full bg-white/[0.07]" />
              <div className="h-1 w-2/3 rounded-full bg-white/[0.05]" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative mx-2 flex justify-around" style={{ height: 18 }} aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-px"
            style={{ height: "100%" }}
            animate={{
              backgroundColor: active ? rgba(TOKEN.accent, 0.35) : rgba(TOKEN.white, 0.08),
            }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          />
        ))}
      </div>

      <motion.div
        className="mx-2 overflow-hidden rounded-md border p-2"
        animate={{
          borderColor: active ? rgba(TOKEN.accent, 0.3) : rgba(TOKEN.white, 0.07),
          backgroundColor: active ? rgba(TOKEN.accent, 0.04) : rgba(TOKEN.white, 0.015),
        }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      >
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[7px] text-text-secondary">shared platform core</span>
          <div className="flex gap-1">
            <div className="h-1 w-4 rounded-full bg-accent/20" />
            <div className="h-1 w-3 rounded-full bg-white/[0.07]" />
          </div>
        </div>
        <div className="flex gap-1">
          {["Auth", "DB", "API", "CDN"].map((label) => (
            <div key={label}
              className="flex-1 rounded-sm border border-white/[0.06] bg-white/[0.02] py-0.5 text-center font-mono text-[6px] text-text-secondary">
              {label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function AutomationInterface({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const nodes = [
    { label: "Trigger", sublabel: "webhook", color: TOKEN.accent },
    { label: "Process", sublabel: "transform", color: TOKEN.accent },
    { label: "Route", sublabel: "condition", color: TOKEN.accentGlow },
    { label: "Done", sublabel: "output", color: TOKEN.success },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.07] bg-[#070910]"
      style={{ height: 148 }}>
      <div className="flex h-6 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-2.5">
        <span className="font-mono text-[8px] text-text-secondary">automation.pipeline</span>
        <motion.div
          className="flex items-center gap-1 font-mono text-[8px]"
          animate={{ color: active ? rgba(TOKEN.accentGlow, 1) : rgba(TOKEN.accentGlow, 0.8) }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            className="h-1 w-1 rounded-full bg-current"
            animate={active && !reducedMotion ? { opacity: [1, 0.3, 1] } : { opacity: 0.4 }}
            transition={{ duration: 1, repeat: Infinity }}
            aria-hidden="true"
          />
          live
        </motion.div>
      </div>

      <div className="flex h-[76px] items-center px-3">
        {nodes.map((node, i) => (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className="flex h-7 w-7 items-center justify-center rounded-lg border"
                animate={{
                  borderColor: active ? rgba(node.color, 1) : rgba(TOKEN.white, 0.08),
                  backgroundColor: active ? rgba(node.color, 0.1) : rgba(TOKEN.white, 0.02),
                  boxShadow: active ? `0 0 10px ${rgba(node.color, 0.2)}` : "none",
                }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                aria-hidden="true"
              >
                <motion.div
                  className="h-2 w-2 rounded-sm"
                  animate={{
                    backgroundColor: active ? rgba(node.color, 1) : rgba(TOKEN.white, 0.15),
                  }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                />
              </motion.div>
              <span className="font-mono text-[7px] text-text-secondary">{node.label}</span>
              <span className="font-mono text-[6px] text-text-secondary">{node.sublabel}</span>
            </div>
            {i < nodes.length - 1 && (
              <div className="relative flex-1 px-0.5">
                <motion.div
                  className="h-px w-full"
                  animate={{
                    backgroundColor: active ? rgba(TOKEN.accent, 0.25) : rgba(TOKEN.white, 0.07),
                  }}
                  transition={{ duration: 0.3 }}
                  aria-hidden="true"
                />
                {!reducedMotion && (
                  <motion.div
                    className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-accent"
                    style={{ left: 0 }}
                    animate={active
                      ? { x: ["0%", "100%"], opacity: [0, 1, 0] }
                      : { x: "0%", opacity: 0 }
                    }
                    transition={{
                      duration: 0.9,
                      delay: i * 0.25,
                      repeat: active ? Infinity : 0,
                      ease: "linear",
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mx-3 space-y-1 border-t border-white/[0.04] pt-2" aria-hidden="true">
        {[
          { prefix: "[✓]", text: "webhook received · 2ms", useGlow: false },
          { prefix: "[~]", text: "processing transform...", useGlow: true },
        ].map((line, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1.5 font-mono text-[7px]"
            animate={{ opacity: active ? 1 : 0.4 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <span
              style={{
                color: line.useGlow ? rgba(TOKEN.accentGlow, 1) : rgba(TOKEN.success, 1),
              }}
            >
              {line.prefix}
            </span>
            <span className="text-text-secondary">{line.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EnterpriseInterface({ active }: { active: boolean; reducedMotion: boolean }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.07] bg-[#070910]"
      style={{ height: 148 }}>
      <div className="flex h-6 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-2.5">
        <span className="font-mono text-[8px] text-text-secondary">enterprise.architecture</span>
        <div className="flex items-center gap-1.5">
          {["ISO", "SOC2", "GDPR"].map((badge) => (
            <motion.span
              key={badge}
              className="rounded-sm px-1 font-mono text-[6px]"
              animate={{
                color: active ? rgba(TOKEN.accent, 1) : rgba(TOKEN.white, 0.7),
                borderColor: active ? rgba(TOKEN.accent, 0.3) : rgba(TOKEN.white, 0.06),
                backgroundColor: active ? rgba(TOKEN.accent, 0.07) : rgba(TOKEN.accent, 0),
              }}
              style={{ border: "1px solid" }}
              transition={{ duration: 0.4 }}
            >
              {badge}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="relative flex h-[calc(100%-24px)] items-center justify-center" aria-hidden="true">
        <motion.div
          className="absolute flex items-center justify-center rounded-full border"
          style={{ width: 112, height: 112 }}
          animate={{
            borderColor: active ? rgba(TOKEN.accent, 0.2) : rgba(TOKEN.white, 0.06),
            boxShadow: active ? `0 0 20px ${rgba(TOKEN.accent, 0.06)}` : "none",
          }}
          transition={{ duration: 0.5 }}
        >
          {[
            { label: "CDN", top: 4, left: "50%", transform: "translateX(-50%)" },
            { label: "DB", bottom: 4, left: "50%", transform: "translateX(-50%)" },
            { label: "LB", top: "50%", left: 4, transform: "translateY(-50%)" },
            { label: "WAF", top: "50%", right: 4, transform: "translateY(-50%)" },
          ].map((item, i) => (
            <motion.span
              key={i}
              className="absolute font-mono text-[6px]"
              style={{
                top: item.top,
                bottom: item.bottom,
                left: item.left,
                right: item.right,
                transform: item.transform,
              }}
              animate={{ color: active ? rgba(TOKEN.accent, 0.7) : rgba(TOKEN.white, 0.18) }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {item.label}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="absolute flex items-center justify-center rounded-full border"
          style={{ width: 72, height: 72 }}
          animate={{
            borderColor: active ? rgba(TOKEN.accent, 0.3) : rgba(TOKEN.white, 0.07),
            backgroundColor: active ? rgba(TOKEN.accent, 0.03) : rgba(TOKEN.accent, 0),
          }}
          transition={{ duration: 0.4, delay: 0.08 }}
        />

        <motion.div
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border"
          animate={{
            borderColor: active ? rgba(TOKEN.accent, 0.5) : rgba(TOKEN.white, 0.1),
            backgroundColor: active ? rgba(TOKEN.accent, 0.12) : rgba(TOKEN.white, 0.03),
            boxShadow: active
              ? `0 0 16px ${rgba(TOKEN.accent, 0.25)}, inset 0 0 8px ${rgba(TOKEN.accent, 0.08)}`
              : "none",
          }}
          transition={{ duration: 0.4, delay: 0.14 }}
        >
          <svg viewBox="0 0 16 16" className="h-5 w-5">
            <motion.path
              d="M8 2L13 4.5V8C13 11 10.5 13.5 8 14C5.5 13.5 3 11 3 8V4.5L8 2Z"
              fill="none"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ stroke: active ? rgba(TOKEN.accent, 1) : rgba(TOKEN.white, 0.25) }}
              transition={{ duration: 0.4 }}
            />
            <motion.path
              d="M6 8L7.5 9.5L10 6.5"
              fill="none"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ stroke: active ? rgba(TOKEN.accent, 1) : rgba(TOKEN.white, 0.2) }}
              transition={{ duration: 0.4, delay: 0.06 }}
            />
          </svg>
        </motion.div>

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {[
            { x1: 50, y1: 10, x2: 50, y2: 34 },
            { x1: 50, y1: 90, x2: 50, y2: 66 },
            { x1: 10, y1: 50, x2: 34, y2: 50 },
            { x1: 90, y1: 50, x2: 66, y2: 50 },
          ].map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              strokeWidth="0.4"
              strokeDasharray="2 1.5"
              animate={{
                stroke: active ? rgba(TOKEN.accent, 0.35) : rgba(TOKEN.white, 0.06),
              }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

const CARD_INTERFACES: Record<
  string,
  React.FC<{ active: boolean; reducedMotion: boolean }>
> = {
  "web-apps": WebAppInterface,
  "software-saas": SaaSInterface,
  "automation": AutomationInterface,
  "enterprise-solutions": EnterpriseInterface,
};

// ─── FEATURED CARD — AI SYSTEMS (untouched) ──────────────────────────────────

function FeaturedCard({
  capability,
  reducedMotion,
  inView,
}: {
  capability: (typeof capabilities)[0];
  reducedMotion: boolean;
  inView: boolean;
}) {
  const Icon = ICON_MAP[capability.icon];

  return (
    <motion.div
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <div
        className="group relative h-full min-h-[400px] overflow-hidden rounded-2xl p-[1px] sm:min-h-[460px] lg:min-h-full"
        style={{
          background:
            "linear-gradient(160deg, rgb(var(--color-accent-primary) / 0.32) 0%, rgb(var(--color-border)) 45%, rgb(var(--color-border)) 100%)",
        }}
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-bg-secondary p-6 sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.09) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              maskImage: "linear-gradient(to top, black 0%, transparent 52%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 52%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent opacity-[0.09] blur-3xl transition-opacity duration-700 group-hover:opacity-[0.17]"
          />
          {!reducedMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/45 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            />
          )}
          <div className="relative flex h-full flex-col">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent sm:text-[11px]">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  animate={reducedMotion ? {} : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Core Capability
              </span>
              {Icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 sm:h-10 sm:w-10">
                  <Icon size={18} strokeWidth={ICON_STROKE_WIDTH} className="text-accent" aria-hidden="true" />
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
              {capability.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:mt-3 sm:text-base">
              {capability.shortDescription}
            </p>
            <div className="mt-5 flex-1 overflow-hidden rounded-xl border border-border/60 bg-bg-primary/80 p-3 font-mono text-[11px] sm:mt-6 sm:p-4 sm:text-xs">
              <div className="mb-2 flex items-center gap-1.5 border-b border-border/40 pb-2 sm:mb-3 sm:gap-2">
                <span className="h-2 w-2 rounded-full bg-error/60" aria-hidden="true" />
                <span className="h-2 w-2 rounded-full bg-warning/60" aria-hidden="true" />
                <span className="h-2 w-2 rounded-full bg-success/60" aria-hidden="true" />
                <span className="ml-1 text-text-tertiary sm:ml-2">agent.ts</span>
              </div>
              <div className="space-y-0.5">
                {AI_CODE_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.35 + i * 0.055, ease: [0.25, 1, 0.5, 1] }}
                    className={cn(
                      "whitespace-pre leading-[1.6]",
                      line.startsWith("//") ? "text-success/70"
                        : line.startsWith("  ") ? "text-text-secondary"
                        : line === "" ? "h-2 sm:h-3"
                        : "text-accent-glow"
                    )}
                  >
                    {line || "\u00A0"}
                  </motion.div>
                ))}
              </div>
            </div>
            <Link
              href="/capabilities"
              className="mt-4 inline-flex items-center gap-2 self-start font-mono text-xs font-medium text-accent transition-all duration-300 hover:gap-3 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary sm:mt-5 sm:text-sm"
            >
              See how we build AI
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── SECONDARY CARD ──────────────────────────────────────────────────────────

function SecondaryCard({
  capability,
  reducedMotion,
  inView,
  index,
}: {
  capability: (typeof capabilities)[0];
  reducedMotion: boolean;
  inView: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isCoarsePointer = useCoarsePointer();

  // Independent per-card scroll trigger — separate from the section-level
  // `inView` (used only for the initial fade+slide entrance). This is
  // what makes touch devices "discover" each card's active state as it
  // individually scrolls into the viewport, rather than relying on a
  // hover event that touch devices never fire.
  const cardRef = useRef<HTMLDivElement>(null);
  const cardScrolledIntoView = useInView(cardRef, { once: true, amount: 0.45 });

  const active = hovered || (isCoarsePointer && cardScrolledIntoView);

  const Interface = CARD_INTERFACES[capability.id];

  return (
    <motion.div
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-bg-secondary"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset" }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reducedMotion ? {} : { y: -2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[1px]"
        animate={{
          background: active
            ? `linear-gradient(to right, transparent, ${rgba(TOKEN.accent, 0.55)} 40%, ${rgba(TOKEN.accent, 0.25)})`
            : `linear-gradient(to right, transparent, ${rgba(TOKEN.white, 0.06)} 50%, transparent)`,
        }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[1px]"
        style={{
          background: `linear-gradient(to bottom, ${rgba(TOKEN.accent, 0.55)}, transparent)`,
        }}
        animate={active && !reducedMotion ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
        style={{ boxShadow: `inset 0 0 0 1px ${rgba(TOKEN.accent, 0.16)}` }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      <div className="relative z-10 p-3 sm:p-4">
        {Interface && <Interface active={active} reducedMotion={reducedMotion} />}
      </div>

      <div className="relative z-10 flex flex-1 flex-col border-t border-white/[0.05] px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <h3 className="text-sm font-semibold text-text-primary transition-colors duration-300 group-hover:text-white sm:text-base">
          {capability.name}
        </h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-text-secondary sm:text-sm">
          {capability.shortDescription}
        </p>
        <motion.div
          className="mt-3 flex items-center gap-1.5 font-mono text-xs text-accent"
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 3 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          Learn more <ArrowRight size={11} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── SECTION ────────────────────────────────────────────────────────────────

export function CapabilitiesTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridInView = useInView(sectionRef, { once: true, margin: "-60px" });

  if (capabilities.length === 0) return null;

  const sorted = [...capabilities].sort((a, b) => a.displayOrder - b.displayOrder);
  const featured = sorted.find((c) => c.isFeatured)!;
  const rest = sorted.filter((c) => !c.isFeatured);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.065) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-[8%] h-[400px] w-[400px] rounded-full bg-accent opacity-[0.04] blur-3xl" />
        <div className="absolute bottom-0 right-[6%] h-[280px] w-[280px] rounded-full bg-accent-glow opacity-[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-12 sm:mb-16">
          <motion.p
            className="mb-3 font-mono text-xs tracking-widest text-accent sm:text-sm"
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            What We Build
          </motion.p>
          <motion.h2
            className="max-w-2xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-5xl"
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Five disciplines.{" "}
            <span className="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
              One standard.
            </span>
          </motion.h2>
          <motion.p
            className="mt-4 max-w-lg text-sm text-text-secondary sm:text-base"
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            Every engagement — regardless of industry or scale — is held to
            the same engineering bar. No exceptions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-2">
          <div className="lg:col-span-2 lg:row-span-2">
            <FeaturedCard
              capability={featured}
              reducedMotion={reducedMotion}
              inView={gridInView}
            />
          </div>
          {rest.map((capability, index) => (
            <SecondaryCard
              key={capability.id}
              capability={capability}
              reducedMotion={reducedMotion}
              inView={gridInView}
              index={index + 1}
            />
          ))}
        </div>

        <motion.div
          className="mt-10 flex justify-center sm:mt-12 lg:justify-start"
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <Link
            href="/capabilities"
            className="group inline-flex items-center gap-2 font-mono text-xs text-text-secondary transition-colors duration-300 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary sm:text-sm"
          >
            Explore all five capabilities
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

