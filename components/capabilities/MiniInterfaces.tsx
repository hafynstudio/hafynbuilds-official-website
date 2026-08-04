"use client";

import { motion } from "framer-motion";
import { FRAMER_COLOR_TOKENS, rgbaToken } from "@/lib/motion";

/**
 * MiniInterfaces — the 4 small "deployed state" mockups used by Home's
 * CapabilitiesTeaser.tsx secondary cards (PRD §2.2.1). Extracted from
 * CapabilitiesTeaser.tsx in Phase 8 once components/capabilities/
 * DeployedInterfaces.tsx became a second real consumer needing the same
 * visual language at full size — this is the "promote once reconfirmed"
 * precedent already established for useCoarsePointer/FRAMER_COLOR_TOKENS.
 *
 * These are PURE presentational components: they render based solely on
 * the `active`/`reducedMotion` props passed in. Activation logic (hover
 * state, touch-device scroll-trigger fallback) lives in the consuming
 * component (CapabilitiesTeaser.tsx's SecondaryCard) — kept separate
 * from rendering so this file has exactly one responsibility.
 *
 * Visual output is byte-identical to the original inline definitions —
 * only the color-token/hook import source changed.
 */

function WebAppInterface({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
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
                  ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.7)
                  : isActiveItem
                  ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.5)
                  : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.1),
              }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
              aria-hidden="true"
            />
          ))}
          <div className="mt-auto h-1.5 w-4 rounded-sm bg-white/[0.07]" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2">
          <motion.div
            className="h-8 w-full rounded-md border border-white/[0.06] bg-white/[0.03]"
            animate={{ y: active ? -1 : 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
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
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.04, ease: [0.25, 1, 0.5, 1] }}
              aria-hidden="true"
            >
              <div className="mb-1 h-1 w-10 rounded-full bg-accent/30" />
              <div className="h-1 w-full rounded-full bg-white/[0.08]" />
              <div className="mt-0.5 h-1 w-3/4 rounded-full bg-white/[0.06]" />
            </motion.div>
            <motion.div
              className="flex-1 rounded-md border border-white/[0.05] bg-white/[0.02] p-1.5"
              animate={{ y: active ? -1 : 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
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
          animate={{ backgroundColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.success, 1) : rgbaToken(FRAMER_COLOR_TOKENS.success, 0.5) }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
        />
        <span className="h-1 w-8 rounded-full bg-white/[0.07]" />
        <span className="ml-auto h-1 w-12 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}

function SaaSInterface({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
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
          animate={{ color: active ? rgbaToken(FRAMER_COLOR_TOKENS.success, 1) : rgbaToken(FRAMER_COLOR_TOKENS.success, 0.5) }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
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
                ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.45)
                : pod.isActivePod
                ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.25)
                : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.05),
            }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.05, ease: [0.25, 1, 0.5, 1] }}
            aria-hidden="true"
          >
            <div className="mb-1 flex items-center gap-1">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: pod.isActivePod
                    ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 1)
                    : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.15),
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
              backgroundColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.35) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.08),
            }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.04 }}
          />
        ))}
      </div>

      <motion.div
        className="mx-2 overflow-hidden rounded-md border p-2"
        animate={{
          borderColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.3) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.07),
          backgroundColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.04) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.015),
        }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
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
    { label: "Trigger", sublabel: "webhook", color: FRAMER_COLOR_TOKENS.accent },
    { label: "Process", sublabel: "transform", color: FRAMER_COLOR_TOKENS.accent },
    { label: "Route", sublabel: "condition", color: FRAMER_COLOR_TOKENS.accentGlow },
    { label: "Done", sublabel: "output", color: FRAMER_COLOR_TOKENS.success },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.07] bg-[#070910]"
      style={{ height: 148 }}>
      <div className="flex h-6 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-2.5">
        <span className="font-mono text-[8px] text-text-secondary">automation.pipeline</span>
        <motion.div
          className="flex items-center gap-1 font-mono text-[8px]"
          animate={{ color: active ? rgbaToken(FRAMER_COLOR_TOKENS.accentGlow, 1) : rgbaToken(FRAMER_COLOR_TOKENS.accentGlow, 0.4) }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
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
                  borderColor: active ? rgbaToken(node.color, 1) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.08),
                  backgroundColor: active ? rgbaToken(node.color, 0.1) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.02),
                  boxShadow: active ? `0 0 10px ${rgbaToken(node.color, 0.2)}` : "none",
                }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.06 }}
                aria-hidden="true"
              >
                <motion.div
                  className="h-2 w-2 rounded-sm"
                  animate={{
                    backgroundColor: active ? rgbaToken(node.color, 1) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.15),
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.3, delay: i * 0.06 }}
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
                    backgroundColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.25) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.07),
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
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
            transition={reducedMotion ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
          >
            <span
              style={{
                color: line.useGlow ? rgbaToken(FRAMER_COLOR_TOKENS.accentGlow, 1) : rgbaToken(FRAMER_COLOR_TOKENS.success, 1),
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

function EnterpriseInterface({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
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
                color: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 1) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.2),
                borderColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.3) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.06),
                backgroundColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.07) : rgbaToken(FRAMER_COLOR_TOKENS.accent, 0),
              }}
              style={{ border: "1px solid" }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
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
            borderColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.2) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.06),
            boxShadow: active ? `0 0 20px ${rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.06)}` : "none",
          }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
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
              animate={{ color: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.7) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.18) }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.05 }}
            >
              {item.label}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="absolute flex items-center justify-center rounded-full border"
          style={{ width: 72, height: 72 }}
          animate={{
            borderColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.3) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.07),
            backgroundColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.03) : rgbaToken(FRAMER_COLOR_TOKENS.accent, 0),
          }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.08 }}
        />

        <motion.div
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border"
          animate={{
            borderColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.5) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.1),
            backgroundColor: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.12) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.03),
            boxShadow: active
              ? `0 0 16px ${rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.25)}, inset 0 0 8px ${rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.08)}`
              : "none",
          }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.14 }}
        >
          <svg viewBox="0 0 16 16" className="h-5 w-5">
            <motion.path
              d="M8 2L13 4.5V8C13 11 10.5 13.5 8 14C5.5 13.5 3 11 3 8V4.5L8 2Z"
              fill="none"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ stroke: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 1) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.25) }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
            />
            <motion.path
              d="M6 8L7.5 9.5L10 6.5"
              fill="none"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ stroke: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 1) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.2) }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.06 }}
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
                stroke: active ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.35) : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.06),
              }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.06 }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export const MINI_INTERFACES: Record<
  string,
  React.FC<{ active: boolean; reducedMotion: boolean }>
> = {
  "web-apps": WebAppInterface,
  "software-saas": SaaSInterface,
  "automation": AutomationInterface,
  "enterprise-solutions": EnterpriseInterface,
};
