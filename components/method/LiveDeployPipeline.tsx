"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { methodStages } from "@/data/method-stages";
import { usePrefersReducedMotion, useCoarsePointer, useIsClient } from "@/lib/hooks";
import { StageNode } from "@/components/method/StageNode";
import { MOTION_VIEWPORT_MARGIN } from "@/lib/motion";
import { StatusLog } from "@/components/method/StatusLog";
import { BuildComplete } from "@/components/method/BuildComplete";
import { CircuitBackground } from "@/components/method/CircuitBackground";

const AnimatedPipeline = dynamic(
  () =>
    import("@/components/method/AnimatedPipeline").then((m) => ({
      default: m.AnimatedPipeline,
    })),
  {
    loading: () => <StaticPipeline />,
  }
);

const N = methodStages.length;

/**
 * The Method route keeps a complete, semantic mobile and reduced-motion
 * implementation in this small entry module. The fine-pointer desktop GSAP
 * pipeline is a separate dynamic chunk, so touch visitors do not download or
 * evaluate ScrollTrigger during initial hydration.
 */
export function LiveDeployPipeline() {
  const isClient = useIsClient();
  const reducedMotion = usePrefersReducedMotion();
  const isCoarsePointer = useCoarsePointer();

  if (!isClient || reducedMotion) return <StaticPipeline />;
  if (isCoarsePointer) return <MobilePipeline />;
  return <AnimatedPipeline />;
}

// ── MOBILE (coarse pointer / touch) ──────────────────────────────────────

function MobilePipeline() {
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const completeRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [buildComplete, setBuildComplete] = useState(false);

  useEffect(() => {
    const stageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.stageIndex);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        });
      },
      { rootMargin: MOTION_VIEWPORT_MARGIN.stageActive, threshold: 0 }
    );
    stageRefs.current.forEach((el) => el && stageObserver.observe(el));

    const completeObserver = new IntersectionObserver(
      ([entry]) => setBuildComplete(!!entry?.isIntersecting),
      { rootMargin: MOTION_VIEWPORT_MARGIN.completion, threshold: 0 }
    );
    if (completeRef.current) completeObserver.observe(completeRef.current);

    return () => {
      stageObserver.disconnect();
      completeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="relative mx-auto max-w-xl px-5 py-14 sm:px-6"
      aria-label="HAFYN BUILDS delivery pipeline"
    >
      <CircuitBackground />

      <div className="relative mb-8">
        <p
          className="mb-2 font-mono text-xs uppercase tracking-widest"
          style={{ color: "rgb(var(--color-accent-primary))" }}
          aria-hidden="true"
        >
          Live Deploy
        </p>
        <h1 className="pb-2 text-3xl font-bold leading-[1.15] text-text-primary sm:text-4xl">
          How we build.
        </h1>
      </div>

      <div className="relative mb-8">
        <StatusLog
          key={`compact-${activeIndex}`}
          activeStageIndex={activeIndex}
          reducedMotion={false}
          compact
        />
      </div>

      <h2 className="sr-only">Five-stage delivery pipeline</h2>

      <div role="list" aria-label="Delivery stages" className="relative">
        {methodStages.map((stage, i) => (
          <div
            key={stage.id}
            ref={(el) => {
              stageRefs.current[i] = el;
            }}
            data-stage-index={i}
            role="listitem"
          >
            <StageNode
              stage={stage}
              progress={i < activeIndex ? 1 : i === activeIndex ? 0.75 : 0}
              isComplete={i < activeIndex}
              isActive={i === activeIndex}
              index={i}
              isLast={i === N - 1}
              reducedMotion={false}
            />
          </div>
        ))}
      </div>

      <div ref={completeRef} className="relative mt-2">
        <BuildComplete isVisible={buildComplete} reducedMotion={false} />
      </div>
    </div>
  );
}

// ── STATIC (prefers-reduced-motion) ──────────────────────────────────────

function StaticPipeline() {
  return (
    <div
      className="relative mx-auto max-w-2xl px-5 py-12 sm:px-8"
      aria-label="HAFYN BUILDS delivery pipeline"
    >
      <CircuitBackground />

      <div className="mb-10">
        <p
          className="mb-2 font-mono text-xs uppercase tracking-widest"
          style={{ color: "rgb(var(--color-accent-primary))" }}
          aria-hidden="true"
        >
          Our Method
        </p>
        <h1 className="pb-2 text-3xl font-bold leading-[1.15] text-text-primary sm:text-4xl">
          How we build.
        </h1>
      </div>

      <h2 className="sr-only">Five-stage delivery pipeline</h2>

      <div role="list" aria-label="Delivery stages">
        {methodStages.map((stage, i) => (
          <div key={stage.id} role="listitem">
            <StageNode
              stage={stage}
              progress={1}
              isComplete={true}
              isActive={false}
              index={i}
              isLast={i === N - 1}
              reducedMotion={true}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <BuildComplete isVisible={true} reducedMotion={true} />
      </div>
    </div>
  );
}
