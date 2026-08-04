"use client";

import dynamic from "next/dynamic";
import { useCoarsePointer, useLazyMount } from "@/lib/hooks";

function LoadingSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center"
      style={{ height: "100vh" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        <span className="font-mono text-xs text-text-tertiary tracking-widest uppercase">
          Initializing Build Console...
        </span>
      </div>
    </div>
  );
}

const BuildConsoleClient = dynamic(
  () =>
    import("@/components/capabilities/BuildConsole").then(
      (m) => ({ default: m.BuildConsole })
    ),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  }
);

/**
 * DynamicBuildConsole — lazy-mounts the BUILD CONSOLE component,
 * skipping the observer overhead entirely on mobile (coarse-pointer)
 * where the sentinel provides no deferral benefit (the observer fires
 * within ~200ms on initial load anyway, per verified viewport math).
 *
 * Desktop (fine-pointer): uses useLazyMount — IntersectionObserver
 * gates the component until the user scrolls within 200px, moving the
 * chunk fetch + GSAP initialization outside Lighthouse's initial-load
 * measurement window.
 *
 * Mobile (coarse-pointer): renders BuildConsoleClient directly —
 * no observer, no skeleton-wait cycle. The next/dynamic loading
 * skeleton still applies naturally during the chunk fetch.
 *
 * The .capabilities-console-reserve + --panel-count CSS class/property
 * are applied in BOTH branches: the @media (pointer: fine) rule
 * reserves GSAP pin-spacer height on desktop; on mobile the guard
 * doesn't apply, so only the harmless min-height: 100vh base takes
 * effect (matching the loading skeleton's own height).
 */
export function DynamicBuildConsole({
  panelCount = 5,
}: {
  panelCount?: number;
}) {
  const isCoarse = useCoarsePointer();
  const { sentinelRef, shouldMount } = useLazyMount(
    { rootMargin: "200px" }
  );

  return (
    <div
      ref={isCoarse ? undefined : sentinelRef}
      className="capabilities-console-reserve"
      style={{ "--panel-count": panelCount } as React.CSSProperties}
    >
      {(isCoarse || shouldMount) ? <BuildConsoleClient /> : <LoadingSkeleton />}
    </div>
  );
}