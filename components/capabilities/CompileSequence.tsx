"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  type MotionValue,
  useTransform,
} from "framer-motion";
import type { Capability } from "@/types/capability";
import { DEPLOYED_INTERFACES } from "@/components/capabilities/DeployedInterfaces";
import { cn } from "@/lib/utils";
import { rgbaToken, FRAMER_COLOR_TOKENS, EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

interface CompileSequenceProps {
  capability: Capability;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  compact: boolean;
  accentRgb: string;
  mobileIndex?: number;
}

// Aggressively early thresholds — deployed UI starts appearing at 38%
// of each panel's local progress so it's fully visible long before the
// panel exits. TYPE_END compressed to 0.25 so typing finishes fast,
// leaving 75% of the panel's dwell time for the deployed UI to shine.
const TYPE_END    = 0.25;
const COMPILE_END = 0.38;
const DEPLOY_FULL = 0.55;

function highlightLine(line: string): React.ReactNode {
  if (line === "") return <span>&nbsp;</span>;
  if (line.trimStart().startsWith("//")) {
    return <span style={{ color: "rgb(34 197 94 / 0.8)" }}>{line}</span>;
  }
  const parts = line.split(
    /(\bconst\b|\bawait\b|\bnew\b|\breturn\b|\basync\b|\bfunction\b|\bexport\b|'[^']*'|"[^"]*"|\b\d+(\.\d+)?\b)/g
  );
  return (
    <>
      {parts.map((tok, i) => {
        if (!tok) return null;
        if (/^(const|await|new|return|async|function|export)$/.test(tok))
          return <span key={i} style={{ color: "rgb(62 123 250 / 1)" }}>{tok}</span>;
        if (/^['"]/.test(tok))
          return <span key={i} style={{ color: "rgb(34 211 238 / 0.9)" }}>{tok}</span>;
        if (/^\d/.test(tok))
          return <span key={i} style={{ color: "rgb(245 158 11 / 0.9)" }}>{tok}</span>;
        return <span key={i} style={{ color: "rgb(250 250 250 / 0.82)" }}>{tok}</span>;
      })}
    </>
  );
}

/**
 * BUG-002 FIX: Zero per-frame setState calls from the scroll-driven animation
 * path. Previously useMotionValueEvent called 3 setState functions per panel
 * per frame (setCharCount, setStatusIdx, setShowDeployed). On the desktop
 * HorizontalCinematic path with 5 panels × 3 setState = 15 setState calls
 * per scroll event, producing 10,708+ User Timing marks and 56,440ms TBT.
 *
 * Replacement:
 * 1. Typewriter reveal: Direct DOM via ref + CSS custom property + clip-path.
 *    React renders ALL code lines in full (syntax-highlighted) always. A
 *    --reveal-pct custom property is set imperatively on each line div,
 *    driving clipPath:inset() to show/hide characters. Zero React renders.
 * 2. Status step progress: Imperative opacity updates via ref, not React
 *    state. Steps are always in the DOM; visibility toggled directly.
 * 3. Cursor blink: CSS @keyframes animation replacing React interval.
 * 4. showDeployed: Retained as threshold-crossing state (fires ONCE per
 *    panel at COMPILE_END), NOT per-frame. Combined with the already-
 *    existing deployedOpacity/deployedY useTransform values that drive
 *    motion.div style directly via Framer's animation engine (zero React
 *    renders from those transforms).
 *
 * Result: zero React re-renders from the scroll-driven animation path.
 * User Timing marks drop from 10,708+ to baseline (0-50 for the page).
 */
export function CompileSequence({
  capability,
  progress,
  reducedMotion,
  compact,
  accentRgb,
  mobileIndex = 0,
}: CompileSequenceProps) {
  const fullText = capability.codeLines.join("\n");

  // State retained only for threshold-crossing events (not per-frame)
  const [showDeployed, setShowDeployed] = useState(reducedMotion);

  // Refs for direct DOM manipulation (no React renders)
  const codeRef      = useRef<HTMLDivElement>(null);
  const statusRef    = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const deployedRef  = useRef(false);

  // Transform values for deployed panel opacity/position (drives motion.div
  // style directly via Framer's animation engine — no React renders).
  const deployedOpacity = useTransform(progress, [COMPILE_END, DEPLOY_FULL], [0, 1]);
  const deployedY       = useTransform(progress, [COMPILE_END, DEPLOY_FULL], [16, 0]);

  // ── Imperative animation callback ──────────────────────────────────────
  // Fires on every progress change. Updates DOM directly via refs — calls
  // setState ONLY for threshold-crossing events (showDeployed, one-shot
  // glow), not per-frame. All per-frame visual work is direct DOM.
  useEffect(() => {
    if (reducedMotion) return;
    let glowQueued = false;

    const unsub = progress.on("change", (v: number) => {
      const fullLineData = capability.codeLines;
      const allLines     = fullText.split("\n");

      // ── 1. Typewriter reveal (direct DOM via ref) ─────────────────────
      const codeNode = codeRef.current;
      if (codeNode) {
        const charCount = v <= TYPE_END
          ? Math.floor((v / TYPE_END) * fullText.length)
          : fullText.length;
        const clampedCount = Math.max(0, Math.min(fullText.length, charCount));
        const revealLines  = fullText.slice(0, clampedCount).split("\n");
        const currentIdx   = Math.min(revealLines.length - 1, allLines.length - 1);
        const lineEls      = codeNode.querySelectorAll<HTMLElement>("[data-code-line]");

        let cumChars = 0;
        for (let i = 0; i < lineEls.length; i++) {
          const el = lineEls[i];
          if (!el) continue;
          const fullLn = allLines[i] ?? "";
          const lnLen  = fullLn.length + 1;

          if (i < currentIdx) {
            el.style.setProperty("--reveal-pct", "100");
            el.style.opacity = "1";
          } else if (i === currentIdx) {
            const charsHere = Math.max(0, clampedCount - cumChars);
            const linePct   = fullLn.length > 0
              ? (charsHere / fullLn.length) * 100
              : 100;
            el.style.setProperty("--reveal-pct", `${Math.min(100, linePct)}`);
            el.style.opacity = "1";
          } else {
            el.style.setProperty("--reveal-pct", "0");
            el.style.opacity = "0";
          }
          cumChars += lnLen;
        }
      }

      // ── 2. Status step visibility (direct DOM via ref) ────────────────
      const statusNode = statusRef.current;
      if (statusNode) {
        const stepEls = statusNode.querySelectorAll<HTMLElement>("[data-status-step]");
        const total   = capability.statusSteps.length;
        let sp = 0;
        if (v >= COMPILE_END) sp = 1;
        else if (v >= TYPE_END) sp = (v - TYPE_END) / (COMPILE_END - TYPE_END);
        const activeIdx = Math.min(total - 1, Math.floor(sp * total));

        stepEls.forEach((el, idx) => {
          const show = idx <= activeIdx;
          (el as HTMLElement).style.opacity = show ? "1" : "0";
        });

        // Pulse dot on current step
        const pulseEls = statusNode.querySelectorAll<HTMLElement>("[data-step-pulse]");
        pulseEls.forEach((el, idx) => {
          (el as HTMLElement).style.opacity = idx === activeIdx ? "1" : "0";
        });
      }

      // ── 3. showDeployed threshold (state — fires ONCE per panel) ─────
      const isDeployed = v >= COMPILE_END;
      if (isDeployed && !deployedRef.current) {
        deployedRef.current = true;
        setShowDeployed(true);

        // One-shot glow burst
        if (!glowQueued) {
          glowQueued = true;
          const gl = glowRef.current;
          if (gl) {
            gl.style.transition = "opacity 0.01s";
            gl.style.opacity = "0.5";
            requestAnimationFrame(() => {
              gl.style.transition = "opacity 1s ease-out";
              gl.style.opacity = "0";
            });
          }
        }
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, fullText, capability.codeLines, capability.statusSteps.length]);

  const DeployedInterface = DEPLOYED_INTERFACES[capability.id];

  // ── COMPACT (mobile) ───────────────────────────────────────────────────
  if (compact) {
    return (
      <MobileCard
        capability={capability}
        accentRgb={accentRgb}
        reducedMotion={reducedMotion}
        mobileIndex={mobileIndex}
        DeployedInterface={DeployedInterface}
      />
    );
  }

  // ── DESKTOP ─────────────────────────────────────────────────────────────
  return (
    <div className="relative flex h-full w-full flex-col">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 20%, rgb(${accentRgb} / 0.06) 0%, transparent 65%)` }} />

      {/* Capability header */}
      <div className="relative flex items-center gap-4 mb-6 shrink-0">
        <span className="font-mono text-sm uppercase tracking-[0.18em] shrink-0" style={{ color: `rgb(${accentRgb})` }}>
          {String(capability.displayOrder).padStart(2, "0")}
        </span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgb(${accentRgb} / 0.5), transparent)` }} aria-hidden="true" />
        <h3 className="text-xl font-bold text-text-primary sm:text-2xl lg:text-3xl shrink-0">{capability.name}</h3>
        <p className="hidden xl:block text-sm text-text-secondary max-w-[220px] text-right leading-snug shrink-0">
          {capability.shortDescription}
        </p>
      </div>

      {/* Two columns */}
      <div className="relative flex-1 grid grid-cols-2 gap-5 min-h-0">

        {/* LEFT: Terminal */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border bg-bg-primary min-h-0"
          style={{ borderColor: `rgb(${accentRgb} / 0.22)`, boxShadow: `0 0 0 1px rgb(${accentRgb} / 0.06),0 20px 40px rgb(0 0 0 / 0.45)` }}>
          {/* Chrome */}
          <div className="flex items-center gap-2 border-b px-4 py-2.5 shrink-0"
            style={{ borderColor: `rgb(${accentRgb} / 0.15)`, background: `rgb(${accentRgb} / 0.04)` }}>
            <span className="h-3 w-3 rounded-full bg-error/70" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-warning/70" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-success/70" aria-hidden="true" />
            <span className="ml-3 font-mono text-xs text-text-secondary">{capability.fileName}</span>
            {/* Status indicator — state-flip driven, not per-frame animated */}
            <div className="ml-auto flex items-center gap-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                animate={{
                  backgroundColor: showDeployed
                    ? rgbaToken(FRAMER_COLOR_TOKENS.success, 1)
                    : `rgb(${accentRgb})`,
                }}
                transition={{ duration: 0.4 }}
              />
              <span className="font-mono text-[10px] text-text-secondary">
                {/* Two labels cross-fading via absolute positioning */}
                <span aria-hidden={showDeployed}
                  className={showDeployed ? "hidden" : undefined}>
                  compiling
                </span>
                <span aria-hidden={!showDeployed}
                  className={!showDeployed ? "hidden" : undefined}>
                  deployed
                </span>
              </span>
            </div>
          </div>

          {/* Code area — typewriter reveal via data-code-line clip + ref */}
          <div className="flex-1 flex flex-col p-5 min-h-0 overflow-hidden">
            <div ref={codeRef} className="flex-1 font-mono text-sm leading-[1.85] overflow-hidden">
              {capability.codeLines.map((line, lineIdx) => (
                <div
                  key={lineIdx}
                  data-code-line={lineIdx}
                  className={cn(
                    line === "" ? "h-[1.85em]" : "whitespace-pre-wrap break-words",
                  )}
                  style={{
                    // clip-path reveals characters left-to-right via --reveal-pct
                    // set imperatively in the progress.on("change") callback.
                    // --reveal-pct = 100: full line visible. 0: hidden.
                    // For the current line being typed, 0-100 reveals progressively.
                    clipPath: "inset(0 calc((100 - var(--reveal-pct, 100)) * 1%) 0 0)",
                    overflow: "hidden",
                  }}
                >
                  {line !== "" ? highlightLine(line) : <span>&nbsp;</span>}
                </div>
              ))}
              {/* Typewriter cursor — CSS blink animation (compositor thread) */}
              {!showDeployed && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[0.9em] ml-px align-middle rounded-sm"
                  style={{
                    backgroundColor: `rgb(${accentRgb})`,
                    animation: "hafyn-blink 1s step-end infinite",
                  }}
                />
              )}
            </div>

            {/* Status log — opacity driven by data-status-step imperative updates */}
            <div
              ref={statusRef}
              className="mt-4 border-t pt-4 space-y-2 shrink-0"
              style={{ borderColor: `rgb(${accentRgb} / 0.2)` }}
            >
              {capability.statusSteps.map((step, i) => (
                <div
                  key={step}
                  data-status-step={i}
                  className="flex items-center gap-2.5 font-mono text-xs"
                  style={{
                    opacity: reducedMotion ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <span className="shrink-0 font-bold text-success">[✓]</span>
                  <span className="text-text-secondary">{step}</span>
                  <span
                    aria-hidden="true"
                    data-step-pulse={i}
                    className="h-1 w-1 rounded-full shrink-0 animate-pulse"
                    style={{
                      backgroundColor: `rgb(${accentRgb})`,
                      opacity: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Deployed UI — opacity driven by useTransform (zero React renders) */}
        <motion.div
          className="relative flex flex-col items-center justify-center rounded-2xl border overflow-hidden"
          style={{
            borderColor: `rgb(${accentRgb} / 0.18)`,
            background: `radial-gradient(ellipse at center, rgb(${accentRgb} / 0.07) 0%, rgb(var(--color-bg-secondary)) 65%)`,
            opacity: reducedMotion ? 1 : deployedOpacity as unknown as number,
            y: reducedMotion ? 0 : deployedY as unknown as number,
          }}
        >
          {/* Corner accents */}
          {["top-0 left-0 border-t border-l","top-0 right-0 border-t border-r","bottom-0 left-0 border-b border-l","bottom-0 right-0 border-b border-r"].map((cls, i) => (
            <div key={i} aria-hidden="true" className={`pointer-events-none absolute w-6 h-6 ${cls}`}
              style={{ borderColor: `rgb(${accentRgb} / 0.35)` }} />
          ))}
          {/* Glow burst — one-shot, driven imperatively via ref */}
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, rgb(${accentRgb} / 0.22) 0%, transparent 60%)`,
              opacity: 0,
            }}
          />
          {/* Live badge */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-3 py-1 z-10"
            style={{
              background: `rgb(${accentRgb} / 0.1)`,
              border: `1px solid rgb(${accentRgb} / 0.3)`,
            }}
          >
            {/* Pulse dot: CSS animation (compositor thread) */}
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: `rgb(${accentRgb})` }}
            />
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: `rgb(${accentRgb})` }}>Live</span>
          </div>
          {/* Mockup */}
          <div className="w-full max-w-xs px-4">
            {DeployedInterface && (
              <div style={{ transform: "scale(1.65)", transformOrigin: "center center" }}>
                <DeployedInterface active={showDeployed} reducedMotion={reducedMotion} />
              </div>
            )}
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[11px] whitespace-nowrap"
            style={{ color: `rgb(${accentRgb} / 0.55)` }}>
            {capability.deployedLabel}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ── MOBILE CARD ───────────────────────────────────────────────────────────────
// FIX (Phase 18 — B1): Removed scroll-scrubbed GSAP ScrollTrigger from
// VerticalPanel entirely. The original implementation created 5 simultaneous
// ScrollTriggers on mobile, each calling progress.set() on every scroll frame,
// each triggering useMotionValueEvent → 3 setState calls → React re-render.
// Combined with 3 repeat:Infinity Framer Motion animations per card × 5 cards
// = 15 infinite JS animation loops on a throttled mobile CPU.
// Result: 88,530ms TBT, 12,693 user timing marks, page load timeout.
//
// Replacement: useInView one-shot reveal (already used by cardInView below).
// Cards animate in once when they enter the viewport. No per-frame JS.
// The scroll-scrubbed typewriter effect is a desktop-only feature (horizontal
// cinematic layout). Mobile gets a clean, instant-reveal card — correct
// for the device class, visually identical to the intended design.

function MobileCard({
  capability,
  accentRgb,
  reducedMotion,
  mobileIndex,
  DeployedInterface,
}: {
  capability: Capability;
  accentRgb: string;
  reducedMotion: boolean;
  mobileIndex: number;
  DeployedInterface: React.FC<{ active: boolean; reducedMotion: boolean }> | undefined;
}) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, amount: 0.15 });
  // Stagger entrance by index — max 200ms so the last card doesn't feel slow
  const delay      = reducedMotion ? 0 : Math.min(mobileIndex * 0.05, 0.2);

  return (
    <motion.div ref={cardRef}
      className="relative w-full overflow-hidden rounded-2xl border bg-bg-secondary"
      style={{ borderColor: `rgb(${accentRgb} / 0.22)`, boxShadow: `0 0 40px rgb(${accentRgb} / 0.07), 0 0 0 1px rgb(${accentRgb} / 0.06), var(--shadow-glass-md)` }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE_OUT_EXPO }}
    >
      <motion.div aria-hidden="true" className="absolute inset-x-0 top-0 h-px pointer-events-none"
        initial={{ scaleX: 0, opacity: 0 }} animate={cardInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: EASE_OUT_EXPO }}
        style={{ background: `linear-gradient(to right, transparent, rgb(${accentRgb} / 0.7), transparent)`}} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 80% 40% at 50% 0%, rgb(${accentRgb} / 0.06) 0%, transparent 60%)` }} />

      {/* Header */}
      <motion.div className="relative flex items-center gap-3 border-b border-border/60 px-4 py-3.5"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={cardInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.15 }}>
        <span className="font-mono text-[11px] uppercase tracking-widest shrink-0 font-bold" style={{ color: `rgb(${accentRgb})` }}>
          {String(capability.displayOrder).padStart(2, "0")}
        </span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgb(${accentRgb} / 0.4), transparent)` }} aria-hidden="true" />
        <h3 className="font-bold text-base text-text-primary tracking-tight">{capability.name}</h3>
      </motion.div>

      {/* Terminal — always shows full code (mobile never scroll-scrubs) */}
      <motion.div className="px-4 pt-4 pb-3"
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={cardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.25, ease: EASE_OUT_QUART }}>
        <div className="rounded-xl border overflow-hidden"
          style={{ borderColor: `rgb(${accentRgb} / 0.18)`, background: "rgb(var(--color-bg-primary))" }}>
          <div className="flex items-center gap-1.5 border-b px-3 py-2.5"
            style={{ borderColor: `rgb(${accentRgb} / 0.12)`, background: `rgb(${accentRgb} / 0.04)` }}>
            <span className="h-2.5 w-2.5 rounded-full bg-error/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" aria-hidden="true" />
            <span className="ml-2 font-mono text-[11px] text-text-secondary">{capability.fileName}</span>
            <div className="ml-auto flex items-center gap-1">
              {/* Static deployed state on mobile — no scroll-driven compiling phase */}
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: rgbaToken(FRAMER_COLOR_TOKENS.success, 1) }} />
              <span className="font-mono text-[9px] text-text-secondary">live</span>
            </div>
          </div>
          <div className="px-4 py-3.5 font-mono text-xs leading-[1.8]">
            {capability.codeLines.map((line, i) => (
              <motion.div key={i} className={line === "" ? "h-[1.4em]" : "whitespace-pre-wrap break-words"}
                initial={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                animate={cardInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: delay + 0.35 + i * 0.04, ease: EASE_OUT_QUART }}>
                {line !== "" && highlightLine(line)}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Status — all steps shown as complete on mobile */}
      <motion.div className="border-t border-border/40 px-4 py-3.5 space-y-2"
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        animate={cardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.55, ease: EASE_OUT_QUART }}>
        {capability.statusSteps.map((step, i) => (
          <motion.div key={step} className="flex items-center gap-2.5 font-mono text-[11px]"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -4 }}
            animate={cardInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: delay + 0.6 + i * 0.07 }}>
            <span className="text-success font-bold">[✓]</span>
            <span className="text-text-secondary">{step}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Deployed interface */}
      <motion.div className="border-t border-border/40 px-4 py-5"
        style={{ background: `radial-gradient(ellipse 90% 60% at 50% 100%, rgb(${accentRgb} / 0.08) 0%, transparent 70%)` }}
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        animate={cardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.75, ease: EASE_OUT_EXPO }}>
        <div className="flex items-center gap-2 mb-4">
          {/* CSS animate-pulse — compositor thread, zero JS cost */}
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full shrink-0 animate-pulse"
            style={{ backgroundColor: `rgb(${accentRgb})` }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: `rgb(${accentRgb})` }}>Live</span>
          <span className="ml-auto font-mono text-[10px] text-text-secondary">{capability.deployedLabel}</span>
        </div>
        {DeployedInterface && (
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: `rgb(${accentRgb} / 0.15)` }}>
            <DeployedInterface active reducedMotion={reducedMotion} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}