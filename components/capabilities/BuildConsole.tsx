"use client";

import { useMemo } from "react";
import { motionValue } from "framer-motion";
import dynamic from "next/dynamic";
import { capabilities } from "@/data/capabilities";
import type { Capability } from "@/types/capability";
import { CompileSequence } from "@/components/capabilities/CompileSequence";
import { usePrefersReducedMotion, useCoarsePointer } from "@/lib/hooks";

export const CAPABILITY_ACCENTS: Record<string, string> = {
  "ai-systems":           "62 123 250",
  "web-apps":             "34 211 238",
  "software-saas":        "168 85 247",
  "automation":           "34 197 94",
  "enterprise-solutions": "245 158 11",
};

// Dynamically imported — loads on desktop only. GSAP/ScrollTrigger are
// static imports inside this chunk, so by the time the component mounts
// (after the dynamic chunk resolves), GSAP is already in memory and the
// useLayoutEffect runs synchronously — no await import() blocking.
const HorizontalCinematic = dynamic(
  () => import("@/components/capabilities/HorizontalCinematic").then(
    (m) => ({ default: m.HorizontalCinematic })
  ),
  { ssr: false, loading: () => <div className="h-screen" /> }
);

export function BuildConsole() {
  const reducedMotion   = usePrefersReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const useVertical     = reducedMotion || isCoarsePointer;

  const sorted = useMemo(
    () => [...capabilities].sort((a, b) => a.displayOrder - b.displayOrder),
    []
  );

  if (capabilities.length === 0) return null;

  return useVertical
    ? <VerticalStack items={sorted} reducedMotion={reducedMotion} />
    : <HorizontalCinematic items={sorted} reducedMotion={reducedMotion} />;
}

// ── MOBILE ────────────────────────────────────────────────────────────

function VerticalStack({ items, reducedMotion }: { items: Capability[]; reducedMotion: boolean }) {
  return (
    <div className="flex flex-col gap-5 px-4 py-8 sm:px-6 sm:gap-6 max-w-2xl mx-auto">
      {items.map((cap, index) => (
        <VerticalPanel key={cap.id} capability={cap} reducedMotion={reducedMotion}
          accentRgb={CAPABILITY_ACCENTS[cap.id] ?? "62 123 250"} index={index} />
      ))}
    </div>
  );
}

function VerticalPanel({
  capability, reducedMotion, accentRgb, index,
}: {
  capability: Capability;
  reducedMotion: boolean;
  accentRgb: string;
  index: number;
}) {
  // Static motion value — MobileCard ignores progress entirely and handles
  // its own entrance animation via useInView + Framer Motion. No GSAP
  // ScrollTrigger needed on mobile. Removing the mobile ScrollTrigger is the
  // critical fix for BUG-001 (88,530ms TBT on mobile was caused by 5
  // simultaneous ScrollTrigger instances driving progress.set() on every
  // scroll pixel, triggering wasteful React re-renders of MobileCard).
  const done = useMemo(() => motionValue(1), []);

  return (
    <div className="w-full">
      <CompileSequence capability={capability} progress={done} reducedMotion={reducedMotion}
        compact accentRgb={accentRgb} mobileIndex={index} />
    </div>
  );
}