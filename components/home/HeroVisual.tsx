"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT_QUART, HERO_SEQUENCE_DELAYS_S } from "@/lib/motion";

const COMMAND_TEXT = "$ hafyn build --target production";
const COMMAND_TYPE_SPEED_MS = 24;
const GAP_AFTER_COMMAND_MS = 400;
const STEP_ACTIVE_DURATIONS_MS = [1200, 1200, 800] as const;
const DEPLOYED_HOLD_MS = 2600;
const FADE_MS = 400;
const RESTART_GAP_MS = 300;
const DOTS_INTERVAL_MS = 400;
const SPINNER_ROTATE_DURATION_S = 0.8;
const ROW_LAYOUT_TRANSITION_S = 0.35;

const PROCESS_LABELS = ["Building", "Optimizing", "Running checks"] as const;
const PROGRESS_BY_STEP: Record<number, number> = { 0: 25, 1: 60, 2: 90 };

const STATUS_BAR_STATS = ["100+ industries", "24h response", "99.9% uptime"];

function LiveBadgeDot({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.span
      className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
      animate={reducedMotion ? { opacity: 0.8 } : { opacity: [0.4, 1, 0.4] }}
      transition={
        reducedMotion
          ? { duration: 0.01 }
          : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}

function StatusIconSlot({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
      {children}
    </span>
  );
}

function SpinnerIcon({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 14 14"
      className="h-3 w-3 text-accent"
      animate={reducedMotion ? {} : { rotate: 360 }}
      transition={
        reducedMotion
          ? undefined
          : { duration: SPINNER_ROTATE_DURATION_S, repeat: Infinity, ease: "linear" }
      }
    >
      <circle
        cx="7" cy="7" r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="26 8.5"
      />
    </motion.svg>
  );
}

function CheckIcon() {
  return (
    <motion.svg
      viewBox="0 0 14 14"
      className="h-3 w-3 text-success"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <path
        d="M3 7.5L5.5 10L11 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function TrailingCursor() {
  return <span className="animate-caret-blink text-accent">▊</span>;
}

interface RowProps {
  lineNumber: number;
  children: React.ReactNode;
}

function Row({ lineNumber, children }: RowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-baseline gap-2.5"
    >
      <span className="w-3 shrink-0 select-none text-right text-[10px] text-text-primary/[0.06]">
        {lineNumber}
      </span>
      <span className="flex-1">{children}</span>
    </motion.div>
  );
}

/**
 * Abstract "live deploy pipeline" visual for the Hero split layout.
 *
 * STATUS-BAR CONTRAST FIX (this pass): the footer stats row previously
 * used `text-tertiary`, which measures ~3.8:1 against this card's actual
 * background (bg-surface/60 composited over bg-bg-primary) — a WCAG AA
 * failure for body text (needs 4.5:1). Switched to `text-secondary`
 * (~7.1:1 against the same background, comfortably passing). To keep
 * the row still reading as visually quieter than the main terminal
 * lines above it, differentiation now comes from smaller size (text-xs,
 * the 12px token — the accessibility-minimum-acceptable size per this
 * fix's own spec) rather than a dimmer color, since dimming further
 * would move contrast in the wrong direction. `gap-y` and slightly
 * larger padding added so a 2-line wrap on narrow mobile widths keeps
 * comfortable breathing room rather than feeling cramped.
 */
export function HeroVisual() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [typedLength, setTypedLength] = useState(0);
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [dotsCount, setDotsCount] = useState(1);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedLength(COMMAND_TEXT.length);
      setStepIndex(3);
      return;
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const after = (fn: () => void, ms: number) => {
      timeouts.push(setTimeout(() => !cancelled && fn(), ms));
    };

    function typeCommand(onDone: () => void) {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setTypedLength(i);
        if (i < COMMAND_TEXT.length) after(tick, COMMAND_TYPE_SPEED_MS);
        else onDone();
      };
      tick();
    }

    function runCycle() {
      setIsFading(false);
      setTypedLength(0);
      setStepIndex(null);

      typeCommand(() => {
        after(() => {
          setStepIndex(0);
          after(() => {
            setStepIndex(1);
            after(() => {
              setStepIndex(2);
              after(() => {
                setStepIndex(3);
                after(() => {
                  setIsFading(true);
                  after(runCycle, FADE_MS + RESTART_GAP_MS);
                }, DEPLOYED_HOLD_MS);
              }, STEP_ACTIVE_DURATIONS_MS[2]);
            }, STEP_ACTIVE_DURATIONS_MS[1]);
          }, STEP_ACTIVE_DURATIONS_MS[0]);
        }, GAP_AFTER_COMMAND_MS);
      });
    }

    runCycle();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setDotsCount((prev) => (prev % 3) + 1);
    }, DOTS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const commandActive = stepIndex === null && typedLength > 0;
  const progressPercent =
    stepIndex === null ? 0 : stepIndex === 3 ? 100 : PROGRESS_BY_STEP[stepIndex];

  let lineNumber = 0;

  return (
    <motion.div
      role="img"
      aria-label="Illustration of an automated build and deployment pipeline"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: HERO_SEQUENCE_DELAYS_S.visualPanel, duration: 0.5 }}
      className="relative w-full overflow-hidden rounded-xl border border-border bg-surface/60 shadow-glass-lg backdrop-blur-md"
    >
      <div aria-hidden="true" className="p-5 pb-8">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <span className="font-mono text-xs text-text-tertiary">
            ~/hafyn-builds/deploy.ts
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-accent">
            <LiveBadgeDot reducedMotion={prefersReducedMotion} />
            live
          </span>
        </div>

        <motion.div
          layout
          transition={{ duration: ROW_LAYOUT_TRANSITION_S, ease: EASE_OUT_QUART }}
          animate={{ opacity: isFading ? 0 : 1 }}
          className="space-y-2 font-mono text-sm"
        >
          <AnimatePresence initial={false}>
            {typedLength > 0 && (
              <Row key="command" lineNumber={++lineNumber}>
                <span className="text-text-tertiary">
                  {COMMAND_TEXT.slice(0, typedLength)}
                  {commandActive && <TrailingCursor />}
                </span>
              </Row>
            )}

            {stepIndex !== null &&
              PROCESS_LABELS.map((label, index) => {
                if (stepIndex < index) return null;
                const isActive = stepIndex === index;
                const isDone = stepIndex > index;
                const dots = isActive ? ".".repeat(dotsCount) : "...";

                return (
                  <Row key={label} lineNumber={++lineNumber}>
                    <span className="flex items-baseline gap-2">
                      <StatusIconSlot>
                        {isActive ? (
                          <SpinnerIcon reducedMotion={prefersReducedMotion} />
                        ) : isDone ? (
                          <CheckIcon />
                        ) : null}
                      </StatusIconSlot>
                      <span className="text-text-secondary">
                        {label}
                        <motion.span
                          animate={
                            isActive && !prefersReducedMotion
                              ? { opacity: [1, 0.7, 1] }
                              : { opacity: 1 }
                          }
                          transition={
                            isActive && !prefersReducedMotion
                              ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                              : { duration: 0.01 }
                          }
                        >
                          {dots}
                        </motion.span>
                        {isActive && <TrailingCursor />}
                      </span>
                    </span>
                  </Row>
                );
              })}

            {stepIndex === 3 && (
              <Row key="deployed" lineNumber={++lineNumber}>
                <span className="flex items-baseline gap-2">
                  <StatusIconSlot>
                    <CheckIcon />
                  </StatusIconSlot>
                  <span className="font-semibold text-success">Deployed</span>
                </span>
              </Row>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-white/10 pt-3.5 font-mono text-xs text-text-secondary">
          {STATUS_BAR_STATS.map((stat, index) => (
            <span key={stat} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">·</span>}
              {stat}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-bg-tertiary">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent-glow"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
        />
      </div>
    </motion.div>
  );
}
