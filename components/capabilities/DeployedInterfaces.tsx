"use client";

import { motion } from "framer-motion";
import { FRAMER_COLOR_TOKENS, rgbaToken } from "@/lib/motion";
import { MINI_INTERFACES } from "@/components/capabilities/MiniInterfaces";

/**
 * DeployedInterfaces — the large-format "deployed state" visuals shown
 * on the right/bottom pane of each Capabilities page CompileSequence
 * (Phase 8, PRD §2.2.4). Reuses the 4 existing Home-teaser mockups via
 * DeployedFrame's CSS-transform scale-up.
 *
 * AI Systems has no Home-teaser mockup (its featured card always shows
 * code, never a deployed UI, per Phase 4 instruction), so
 * AIDashboardInterface is a Capabilities-page-only addition matching
 * the identical visual grammar.
 */

function AIDashboardInterface({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const metrics = [
    { label: "Requests", value: "1,204/hr" },
    { label: "Latency", value: "82ms" },
    { label: "Uptime", value: "99.9%" },
  ];

  const logLines = [
    { prefix: "[✓]", text: "request handled · 82ms" },
    { prefix: "[✓]", text: "tool call: writeCode" },
    { prefix: "[~]", text: "reasoning..." },
  ];

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-white/[0.07] bg-[#070910]"
      style={{ height: 148 }}
    >
      <div className="flex h-6 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-2.5">
        <span className="font-mono text-[8px] text-text-secondary">agent.hafyn.io</span>
        <motion.span
          className="flex items-center gap-1 font-mono text-[8px]"
          animate={{
            color: active
              ? rgbaToken(FRAMER_COLOR_TOKENS.success, 1)
              : rgbaToken(FRAMER_COLOR_TOKENS.success, 0.5),
          }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
        >
          <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
          online
        </motion.span>
      </div>

      <div className="flex gap-1.5 px-2.5 pt-2.5">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            className="flex-1 rounded-md border p-1.5"
            animate={{
              borderColor: active
                ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.3)
                : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.06),
              backgroundColor: active
                ? rgbaToken(FRAMER_COLOR_TOKENS.accent, 0.05)
                : rgbaToken(FRAMER_COLOR_TOKENS.white, 0.015),
            }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.05 }}
          >
            <div className="font-mono text-[6px] text-text-secondary">{metric.label}</div>
            <div className="mt-0.5 font-mono text-[10px] font-semibold text-white/80">
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-2.5 mt-2.5 space-y-1">
        {logLines.map((line, i) => (
          <motion.div
            key={line.text}
            className="flex items-center gap-1.5 font-mono text-[7px]"
            animate={{ opacity: active ? 1 : 0.4 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.3, delay: i * 0.05 }}
          >
            <span style={{ color: rgbaToken(FRAMER_COLOR_TOKENS.accentGlow, 1) }}>
              {line.prefix}
            </span>
            <span className="text-text-secondary">{line.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const DEPLOYED_INTERFACES: Record<
  string,
  React.FC<{ active: boolean; reducedMotion: boolean }>
> = {
  ...MINI_INTERFACES,
  "ai-systems": AIDashboardInterface,
};

/**
 * DeployedFrame — centers and scales up a MiniInterfaces-sized (148px
 * tall) mockup to a larger "deployed" scale using a CSS `transform:
 * scale()` (GPU-accelerated, no re-layout cost). Text inside the scaled
 * mockups is real DOM text, not raster, so it scales crisply.
 *
 * scale/height are now PARAMETERIZED (previously hardcoded to
 * 1.85/300px, tuned only for the desktop cinematic card). Mobile's
 * compact CompileSequence variant passes a smaller scale (1.15) and
 * height (190) proportionate to a narrow phone column — the desktop
 * value was never designed to fit a ~320px-wide mobile card and
 * visually overwhelmed it. `overflow-hidden` added on the outer wrapper
 * (previously missing) so a scaled child can never visually escape its
 * intended box regardless of scale factor — a defensive fix that also
 * removes any risk of this component contributing to cross-section
 * visual bleed.
 */
export function DeployedFrame({
  children,
  scale = 1.85,
  height = 300,
}: {
  children: React.ReactNode;
  scale?: number;
  height?: number;
}) {
  return (
    <div
      className="relative mx-auto w-full max-w-xl overflow-hidden"
      style={{ height }}
    >
      <div
        className="absolute left-1/2 top-1/2 w-full max-w-sm"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
