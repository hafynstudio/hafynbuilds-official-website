"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { motionValue, type MotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Capability } from "@/types/capability";
import { CompileSequence } from "@/components/capabilities/CompileSequence";

gsap.registerPlugin(ScrollTrigger);

const HEADER_PX = 64;

// Fraction of each panel's slot spent sliding in / dwelling / sliding out
const DEPART_FRACTION = 0.15; // 0.85 → 1.00 = sliding out (last panel skips this)

const ACCENTS: Record<string, string> = {
  "ai-systems":           "62 123 250",
  "web-apps":             "34 211 238",
  "software-saas":        "168 85 247",
  "automation":           "34 197 94",
  "enterprise-solutions": "245 158 11",
};

export function HorizontalCinematic({
  items,
  reducedMotion,
}: {
  items: Capability[];
  reducedMotion: boolean;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const n = items.length;

  const progressValues = useMemo<MotionValue<number>[]>(
    () => items.map(() => motionValue(0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // GSAP is a static import at module scope in this file, so by the time
  // this component mounts (after the dynamic chunk resolves), GSAP is
  // already in memory. The useLayoutEffect runs synchronously — no
  // await import() blocking inside the effect body.
  useLayoutEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const getPanelWidth  = () => outer.clientWidth;
    // Total scroll distance = n × panel width (1 full viewport per panel)
    const getTotalScroll = () => getPanelWidth() * n;
    // Track only needs to travel (n-1) panel widths
    const getTrackTravel = () => getPanelWidth() * (n - 1);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outer,
        start: `top ${HEADER_PX}px`,
        end: () => `+=${getTotalScroll()}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.0,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const master = self.progress;

          // ─── TRACK POSITION ────────────────────────────────────────
          // Track moves smoothly from 0 to -trackTravel across the
          // ENTIRE master range. This means the last panel's slide-in
          // completes just before master ends.
          gsap.set(track, { x: -getTrackTravel() * master });

          // ─── PER-PANEL PROGRESS ────────────────────────────────────
          // Each panel owns 1/n of master range.
          // Within each panel's slot [i/n, (i+1)/n]:
          //   - Progress starts ramping at slot start (arrive phase begins)
          //   - Progress reaches 1.0 at end of dwell phase (0.85 of slot)
          //   - Progress stays at 1.0 during depart phase (0.85-1.00)
          // This means by ~65% through each panel's slot, its compile
          // sequence is COMPLETE and the deployed UI is fully shown.
          const slotSize = 1 / n;
          for (let i = 0; i < n; i++) {
            const slotStart = i * slotSize;
            const slotEnd   = (i + 1) * slotSize;
            // Content should complete by end of DWELL (0.85 of slot)
            const contentEnd = slotStart + slotSize * (1 - DEPART_FRACTION);

            let localProgress: number;
            if (master < slotStart) {
              localProgress = 0;
            } else if (master >= contentEnd) {
              localProgress = 1;
            } else {
              // Ramp from 0→1 across [slotStart, contentEnd]
              localProgress = (master - slotStart) / (contentEnd - slotStart);
            }
            progressValues[i]?.set(localProgress);
          }

          // ─── SPINE DOTS ────────────────────────────────────────────
          // Active panel = whichever slot master is currently in
          const activeIdx = Math.min(n - 1, Math.floor(master * n));
          outer.querySelectorAll("[data-dot]").forEach((el, i) => {
            const dot = el as HTMLElement;
            const accent = ACCENTS[items[i]?.id ?? ""] ?? "62 123 250";
            dot.style.backgroundColor = i <= activeIdx ? `rgb(${accent})` : "rgb(42 42 49)";
            dot.style.transform = i === activeIdx ? "scale(1.5)" : "scale(1)";
            dot.style.boxShadow = i === activeIdx ? `0 0 8px rgb(${accent} / 0.9)` : "none";
          });
          outer.querySelectorAll("[data-label]").forEach((el, i) => {
            (el as HTMLElement).style.opacity = i === activeIdx ? "1" : "0";
            (el as HTMLElement).style.maxWidth = i === activeIdx ? "140px" : "0px";
          });
        },
      });
    }, outerRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const panelH = `calc(100vh - ${HEADER_PX}px)`;

  return (
    <div ref={outerRef} className="relative overflow-hidden" style={{ height: panelH }}>

      {/* Progress spine */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3.5 pointer-events-none" aria-hidden="true">
        {items.map((cap, i) => {
          const accent = ACCENTS[cap.id] ?? "62 123 250";
          return (
            <div key={cap.id} className="flex items-center gap-2.5">
              <div data-dot className="h-2 w-2 rounded-full transition-all duration-500"
                style={{ backgroundColor: i === 0 ? `rgb(${accent})` : "rgb(42 42 49)", boxShadow: i === 0 ? `0 0 8px rgb(${accent} / 0.9)` : "none", transform: i === 0 ? "scale(1.5)" : "scale(1)" }} />
              <span data-label className="font-mono text-[9px] uppercase tracking-widest overflow-hidden whitespace-nowrap transition-all duration-300"
                style={{ color: `rgb(${accent} / 0.75)`, opacity: i === 0 ? 1 : 0, maxWidth: i === 0 ? "140px" : "0px" }}>
                {cap.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2 pointer-events-none" style={{ opacity: 0.35 }} aria-hidden="true">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Scroll</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-tertiary">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Track */}
      <div ref={trackRef} className="flex h-full" style={{ width: `${n * 100}vw`, willChange: "transform" }}>
        {items.map((capability, i) => {
          const accent = ACCENTS[capability.id] ?? "62 123 250";
          return (
            <div key={capability.id} className="relative flex h-full shrink-0 items-center justify-center"
              style={{ width: "100vw", paddingLeft: "7vw", paddingRight: "5vw" }}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(ellipse 55% 50% at 50% 50%, rgb(${accent} / 0.055) 0%, transparent 70%)` }} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: `radial-gradient(circle, rgb(${accent} / 0.18) 1px, transparent 1px)`, backgroundSize: "36px 36px", maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 0%, transparent 78%)", WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 0%, transparent 78%)", opacity: 0.5 }} />
              <div className="relative w-full" style={{ height: `calc(${panelH} - 80px)`, maxWidth: "1200px" }}>
                <CompileSequence
                  capability={capability}
                  progress={progressValues[i]}
                  reducedMotion={reducedMotion}
                  compact={false}
                  accentRgb={accent}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}