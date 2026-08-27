"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface LogLine {
  id: string;
  text: string;
  type: "info" | "success" | "warning" | "system";
}

interface StatusLogProps {
  /** Which stage index (0-based) is currently active */
  activeStageIndex: number;
  reducedMotion: boolean;
  /** Compact mobile variant — fixed height, smaller padding.
   * MUST be true on the MobilePipeline consumer: fixed height prevents
   * the log's own line-stagger from growing the log panel, which would
   * otherwise reflow the page mid-scroll, shift the active stage, and
   * trigger new logs — a compounding feedback loop. */
  compact?: boolean;
}

const STAGE_LOGS: LogLine[][] = [
  // Discovery
  [
    { id: "d1", text: "> Initialising project workspace...",    type: "system"  },
    { id: "d2", text: "  Stakeholder briefing scheduled.",       type: "info"    },
    { id: "d3", text: "  Parsing business requirements...",      type: "info"    },
    { id: "d4", text: "  Technical constraints mapped.",         type: "info"    },
    { id: "d5", text: "✓ Requirements document locked.",         type: "success" },
  ],
  // Design
  [
    { id: "ds1", text: "> Loading system design toolchain...",   type: "system"  },
    { id: "ds2", text: "  Drafting data models...",              type: "info"    },
    { id: "ds3", text: "  API contracts defined.",               type: "info"    },
    { id: "ds4", text: "  UI/UX review checkpoint passed.",      type: "info"    },
    { id: "ds5", text: "✓ Architecture finalised.",              type: "success" },
  ],
  // Build
  [
    { id: "b1", text: "> Compiling production bundle...",        type: "system"  },
    { id: "b2", text: "  Running type checks — 0 errors.",       type: "info"    },
    { id: "b3", text: "  Test suite passed (98% coverage).",     type: "info"    },
    { id: "b4", text: "  Staging deploy verified.",              type: "info"    },
    { id: "b5", text: "✓ Shipping to production.",               type: "success" },
  ],
  // Launch
  [
    { id: "l1", text: "> Zero-downtime deploy initiated...",     type: "system"  },
    { id: "l2", text: "  DNS propagation complete.",             type: "info"    },
    { id: "l3", text: "  Monitoring & alerting configured.",     type: "info"    },
    { id: "l4", text: "  Handover session confirmed.",           type: "info"    },
    { id: "l5", text: "✓ Deployed to production.",               type: "success" },
  ],
  // Support
  [
    { id: "s1", text: "> Support contract active.",              type: "system"  },
    { id: "s2", text: "  All systems nominal — 24/7 monitoring.", type: "info"    },
    { id: "s3", text: "  Performance budget: within limits.",    type: "info"    },
    { id: "s4", text: "  Next iteration cycle: scheduled.",      type: "info"    },
    { id: "s5", text: "✓ System nominal.",                       type: "success" },
  ],
];

const TYPE_COLOR: Record<LogLine["type"], string> = {
  system:  "rgb(var(--color-text-tertiary))",
  info:    "rgb(161 161 170)",
  success: "rgb(34 197 94)",
  warning: "rgb(245 158 11)",
};

export function StatusLog({ activeStageIndex, reducedMotion, compact = false }: StatusLogProps) {
  const [visibleLines, setVisibleLines] = useState<LogLine[]>([]);
  // FIX (Phase 2, CODE-001): previously a single timerRef was overwritten
  // each iteration, so only the LAST per-line timer was tracked and cleared.
  // Earlier pending timers kept firing after a stage change and appended
  // stale lines from the previous stage. All scheduled timers are now
  // tracked and cleared together.
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const lines = STAGE_LOGS[activeStageIndex] ?? [];

    if (reducedMotion) return;

    lines.forEach((line, i) => {
      const timer = setTimeout(() => {
        setVisibleLines(prev => {
          if (prev.some(p => p.id === line.id)) return prev;
          return [...prev, line];
        });
      }, i * 260);
      timersRef.current.push(timer);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [activeStageIndex, reducedMotion]);

  return (
    <div
      className="rounded-xl border p-4 sm:p-5"
      style={{
        borderColor: "rgb(42 42 49)",
        backgroundColor: "rgb(15 15 17)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
        // Fixed height (not min-height) — the ONLY way to guarantee no
        // reflow on mobile as lines stagger in. Desktop keeps its
        // generous 180px min-height feel via the explicit fixed value.
        height: compact ? 200 : 220,
      }}
      aria-label="Live deployment log"
      role="log"
      aria-live="polite"
    >
      {/* Terminal header bar */}
      <div className="mb-3 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          hafyn-deploy — log
        </span>
      </div>

      {/* Log lines — internal overflow clipped so no growth ever escapes.
          Column layout keeps the blinking cursor pinned right after the
          last visible line regardless of how many lines have streamed. */}
      <div
        className="flex flex-col gap-1.5 overflow-hidden font-mono text-[11px] sm:text-xs"
        style={{ height: "calc(100% - 28px)" }}
      >
        <AnimatePresence initial={false}>
          {(reducedMotion
            ? STAGE_LOGS[activeStageIndex] ?? []
            : visibleLines
          ).map((line) => (
            <motion.p
              key={line.id}
              initial={reducedMotion ? false : { opacity: 0, x: -8 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: EASE_OUT_EXPO }
              }
              style={{ color: TYPE_COLOR[line.type] }}
              className="whitespace-nowrap"
            >
              {line.text}
            </motion.p>
          ))}
        </AnimatePresence>

        <span
          className="inline-block h-3 w-1.5 animate-pulse motion-reduce:animate-none"
          style={{ backgroundColor: "rgb(62 123 250 / 0.7)" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
