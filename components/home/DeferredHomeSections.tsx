"use client";

import dynamic from "next/dynamic";
import { useLazyMount } from "@/lib/hooks";

const CapabilitiesTeaser = dynamic(
  () =>
    import("@/components/home/CapabilitiesTeaser").then((m) => ({
      default: m.CapabilitiesTeaser,
    })),
  { ssr: false, loading: () => null }
);
const MethodTeaser = dynamic(
  () =>
    import("@/components/home/MethodTeaser").then((m) => ({
      default: m.MethodTeaser,
    })),
  { ssr: false, loading: () => null }
);
const FeaturedWork = dynamic(
  () =>
    import("@/components/home/FeaturedWork").then((m) => ({
      default: m.FeaturedWork,
    })),
  { ssr: false, loading: () => null }
);
const FounderTeaser = dynamic(
  () =>
    import("@/components/home/FounderTeaser").then((m) => ({
      default: m.FounderTeaser,
    })),
  { ssr: false, loading: () => null }
);
const ValuesSection = dynamic(
  () =>
    import("@/components/home/ValuesSection").then((m) => ({
      default: m.ValuesSection,
    })),
  { ssr: false, loading: () => null }
);
const FinalCTA = dynamic(
  () =>
    import("@/components/home/FinalCTA").then((m) => ({
      default: m.FinalCTA,
    })),
  { ssr: false, loading: () => null }
);

function DeferredSection({
  minHeight,
  children,
}: {
  minHeight: string;
  children: React.ReactNode;
}) {
  const { sentinelRef, shouldMount } = useLazyMount({ rootMargin: "200px" });

  return (
    <div ref={sentinelRef} style={{ minHeight }}>
      {shouldMount ? children : null}
    </div>
  );
}

/**
 * Below-fold Home sections are mounted on approach, not during initial
 * hydration. Their reserved heights are unchanged, so the visitor sees the
 * same page rhythm and the sections still arrive before they enter view.
 */
export function DeferredHomeSections() {
  return (
    <>
      <DeferredSection minHeight="1100px">
        <CapabilitiesTeaser />
      </DeferredSection>
      <DeferredSection minHeight="800px">
        <MethodTeaser />
      </DeferredSection>
      <DeferredSection minHeight="1500px">
        <FeaturedWork />
      </DeferredSection>
      <DeferredSection minHeight="700px">
        <FounderTeaser />
      </DeferredSection>
      <DeferredSection minHeight="1200px">
        <ValuesSection />
      </DeferredSection>
      <DeferredSection minHeight="700px">
        <FinalCTA />
      </DeferredSection>
    </>
  );
}
