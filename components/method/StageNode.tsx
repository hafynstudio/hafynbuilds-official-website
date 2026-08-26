"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronDown, Clock, Users, Package } from "lucide-react";
import type { MethodStage } from "@/types/method-stage";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

interface StageNodeProps {
  stage: MethodStage;
  /** 0–1 scroll-driven activation progress for this stage */
  progress: number;
  /** Whether this stage has fully activated (progress >= 1) */
  isComplete: boolean;
  /** Whether this stage is the currently active one */
  isActive: boolean;
  /** Index in the pipeline (0-based) */
  index: number;
  /** Whether this is the last stage (no connector line below) */
  isLast: boolean;
  /** Whether to skip motion (prefers-reduced-motion) */
  reducedMotion: boolean;
}

const STAGE_ACCENT: Record<string, string> = {
  discovery:  "62 123 250",   // blue
  design:     "168 85 247",   // purple
  build:      "34 211 238",   // cyan
  launch:     "34 197 94",    // green
  support:    "245 158 11",   // amber
};

export function StageNode({
  stage, progress, isComplete, isActive, index, isLast, reducedMotion,
}: StageNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const accent = STAGE_ACCENT[stage.id] ?? "62 123 250";
  const accentCss = `rgb(${accent})`;

  // Connector line height driven by progress (0 → full)
  const connectorFill = isComplete ? 1 : Math.max(0, (progress - 0.6) / 0.4);

  const nodeVariants = {
    idle:    { scale: 1,    boxShadow: `0 0 0px rgb(${accent} / 0)` },
    active:  { scale: 1.08, boxShadow: `0 0 24px rgb(${accent} / 0.55), 0 0 8px rgb(${accent} / 0.9)` },
    complete:{ scale: 1,    boxShadow: `0 0 16px rgb(${accent} / 0.35)` },
  };

  const nodeState = isComplete ? "complete" : isActive ? "active" : "idle";

  return (
    <div className="relative flex gap-6 sm:gap-10">

      {/* ── Left column: node + connector ── */}
      <div className="relative flex flex-col items-center" style={{ minWidth: 48 }}>

        {/* Node circle */}
        <motion.button
          onClick={() => (isActive || isComplete) && setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-label={`${stage.name} stage — ${isActive || isComplete ? "click to expand" : "not yet reached"}`}
          variants={reducedMotion ? {} : nodeVariants}
          animate={nodeState}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          style={{
            borderColor: isActive || isComplete ? accentCss : "rgb(42 42 49)",
            backgroundColor: isComplete
              ? `rgb(${accent} / 0.15)`
              : isActive
              ? `rgb(${accent} / 0.10)`
              : "rgb(22 22 26)",
            cursor: isActive || isComplete ? "pointer" : "default",
            // focus ring color matches accent
            ["--tw-ring-color" as string]: accentCss,
          }}
        >
          {isComplete ? (
            <CheckCircle
              size={20}
              strokeWidth={2}
              style={{ color: accentCss }}
              aria-hidden="true"
            />
          ) : (
            <span
              className="font-mono text-xs font-bold tabular-nums"
              style={{ color: isActive ? accentCss : "rgb(113 113 122)" }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </motion.button>

        {/* Connector line below node */}
        {!isLast && (
          <div
            className="relative mt-1 w-px flex-1"
            style={{ minHeight: 64, backgroundColor: "rgb(42 42 49)" }}
            aria-hidden="true"
          >
            <motion.div
              className="absolute top-0 left-0 w-full origin-top"
              style={{ backgroundColor: accentCss }}
              animate={reducedMotion ? {} : { scaleY: connectorFill, opacity: connectorFill > 0 ? 1 : 0 }}
              initial={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
            />
          </div>
        )}
      </div>

      {/* ── Right column: content ── */}
      <div className="flex-1 pb-12">

        {/* Stage header */}
        <motion.div
          initial={
            reducedMotion
              ? false
              : { opacity: index === 0 ? 1 : 0, x: 16 }
          }
          animate={
            reducedMotion
              ? { opacity: isActive || isComplete ? 1 : 0.35 }
              : { opacity: isActive || isComplete ? 1 : 0.35, x: 0 }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.05 }
          }
          className="flex items-start justify-between gap-4"
        >
          <div>
            {/* Eyebrow */}
            <p
              className="mb-1 font-mono text-xs uppercase tracking-widest"
              style={{ color: isActive || isComplete ? accentCss : "rgb(76 76 83)" }}
            >
              Stage {String(index + 1).padStart(2, "0")}
            </p>

            {/* Stage name */}
            <h3
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: isActive || isComplete ? "rgb(250 250 250)" : "rgb(76 76 83)" }}
            >
              {stage.name}
            </h3>

            {/* Short description */}
            <p
              className="mt-2 max-w-md text-sm leading-relaxed sm:text-base"
              style={{ color: isActive || isComplete ? "rgb(161 161 170)" : "rgb(76 76 83)" }}
            >
              {stage.shortDescription}
            </p>
          </div>

          {/* Expand chevron — only when reachable */}
          {(isActive || isComplete) && (
            <button
              onClick={() => setExpanded(v => !v)}
              aria-label={expanded ? "Collapse stage detail" : "Expand stage detail"}
              className="mt-1 shrink-0 rounded-full p-1.5 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              style={{ ["--tw-ring-color" as string]: accentCss }}
            >
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.25, ease: EASE_OUT_QUART }
                }
              >
                <ChevronDown size={18} style={{ color: accentCss }} aria-hidden="true" />
              </motion.div>
            </button>
          )}
        </motion.div>

        {/* Expanded detail panel */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="detail"
              initial={{ height: reducedMotion ? "auto" : 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: reducedMotion ? "auto" : 0, opacity: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.35, ease: EASE_OUT_QUART }
              }
              className="overflow-hidden"
            >
              <div
                className="mt-4 rounded-xl border p-5 sm:p-6"
                style={{
                  borderColor: `rgb(${accent} / 0.20)`,
                  backgroundColor: `rgb(${accent} / 0.04)`,
                  boxShadow: `0 0 32px rgb(${accent} / 0.06) inset`,
                }}
              >
                {/* Full description */}
                <p className="mb-5 text-sm leading-relaxed text-text-secondary sm:text-base">
                  {stage.expandedDescription}
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Deliverables */}
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Package size={13} style={{ color: accentCss }} aria-hidden="true" />
                      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accentCss }}>
                        Deliverables
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {stage.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-1.5 text-xs text-text-secondary">
                          <span style={{ color: accentCss }} aria-hidden="true">›</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Timeframe */}
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Clock size={13} style={{ color: accentCss }} aria-hidden="true" />
                      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accentCss }}>
                        Timeframe
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{stage.timeframe}</p>
                  </div>

                  {/* Client involvement */}
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Users size={13} style={{ color: accentCss }} aria-hidden="true" />
                      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accentCss }}>
                        Your Involvement
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{stage.clientInvolvement}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status log line */}
        <AnimatePresence>
          {isActive && !expanded && (
            <motion.div
              key="status"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.3, ease: EASE_OUT_EXPO }
              }
              className="mt-3 flex items-center gap-2"
              aria-live="polite"
              aria-label={`Current status: ${stage.statusLabel}`}
            >
              {/* Pulsing dot */}
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span
                  className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full opacity-75"
                  style={{ backgroundColor: accentCss }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: accentCss }}
                />
              </span>
              <span className="font-mono text-xs" style={{ color: `rgb(${accent} / 0.75)` }}>
                {stage.statusLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
