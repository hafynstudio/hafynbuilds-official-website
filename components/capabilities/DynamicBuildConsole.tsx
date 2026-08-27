"use client";

import dynamic from "next/dynamic";
import { useLazyMount } from "@/lib/hooks";

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
 * DynamicBuildConsole — keeps a full-height reserved slot while deferring
 * the build-console client graph until the user reaches the console. This
 * applies to touch and fine-pointer devices: the mobile path no longer
 * downloads the five-panel interactive runtime during initial hydration.
 * The reserved slot is already the loading skeleton's full viewport height,
 * so delaying the client component cannot collapse the page.
 */
export function DynamicBuildConsole({
  panelCount = 5,
}: {
  panelCount?: number;
}) {
  const { sentinelRef, shouldMount } = useLazyMount({ rootMargin: "0px" });

  return (
    <div
      ref={sentinelRef}
      className="capabilities-console-reserve"
      style={{ "--panel-count": panelCount } as React.CSSProperties}
    >
      {shouldMount ? <BuildConsoleClient /> : <LoadingSkeleton />}
    </div>
  );
}