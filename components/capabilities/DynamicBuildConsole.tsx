"use client";

import { useEffect, useState } from "react";
import { useLazyMount } from "@/lib/hooks";
import { MOTION_VIEWPORT_MARGIN } from "@/lib/motion";
import type { BuildConsole } from "@/components/capabilities/BuildConsole";

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

type BuildConsoleComponent = typeof BuildConsole;

/**
 * Keeps a full-height reserved slot while deferring the build-console client
 * graph until the user reaches the console. The import is imperative rather
 * than a top-level next/dynamic declaration, preventing an initial preload.
 */
export function DynamicBuildConsole({
  panelCount = 5,
}: {
  panelCount?: number;
}) {
  const { sentinelRef, shouldMount } = useLazyMount({ rootMargin: MOTION_VIEWPORT_MARGIN.onArrival });
  const [BuildConsoleClient, setBuildConsoleClient] =
    useState<BuildConsoleComponent | null>(null);

  useEffect(() => {
    if (!shouldMount || BuildConsoleClient) return;
    let active = true;
    void import("@/components/capabilities/BuildConsole").then((module) => {
      if (active) setBuildConsoleClient(() => module.BuildConsole);
    });
    return () => {
      active = false;
    };
  }, [shouldMount, BuildConsoleClient]);

  return (
    <div
      ref={sentinelRef}
      className="capabilities-console-reserve"
      style={{ "--panel-count": panelCount } as React.CSSProperties}
    >
      {BuildConsoleClient ? <BuildConsoleClient /> : <LoadingSkeleton />}
    </div>
  );
}
