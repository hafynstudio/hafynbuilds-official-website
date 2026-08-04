"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { methodStages } from "@/data/method-stages";
import { usePrefersReducedMotion, useCoarsePointer } from "@/lib/hooks";
import { StageNode } from "@/components/method/StageNode";
import { StatusLog } from "@/components/method/StatusLog";
import { BuildComplete } from "@/components/method/BuildComplete";
import { CircuitBackground } from "@/components/method/CircuitBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADER_PX = 64;
const N = methodStages.length;
const COMPLETE_START = 0.9;
const STAGE_SLOT = COMPLETE_START / N;

/**
 * Vertical breathing room INSIDE the clipping viewport. Reserved so
 * that a node's activation glow (boxShadow ~24px) and heading descender
 * letters (y, g, and rounded caps like B/W in the display font) never
 * get sliced by the viewport's overflow-hidden edge. Included in the
 * track-transform math so scroll travel stays perfectly aligned.
 */
const VIEWPORT_INSET_Y = 40;

export function LiveDeployPipeline() {
  const reducedMotion = usePrefersReducedMotion();
  const isCoarsePointer = useCoarsePointer();

  if (reducedMotion) return <StaticPipeline />;
  if (isCoarsePointer) return <MobilePipeline />;
  return <AnimatedPipeline />;
}

// ── DESKTOP (fine pointer) ──────────────────────────────────────────────

function AnimatedPipeline() {
  const outerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackHeightRef = useRef(0);

  const [stageProgress, setStageProgress] = useState<number[]>(() =>
    methodStages.map(() => 0)
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [buildComplete, setBuildComplete] = useState(false);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!outer || !viewport || !track) return;

    function measureTrack() {
      if (track) trackHeightRef.current = track.scrollHeight;
    }
    measureTrack();

    const totalScroll = () => window.innerHeight * (N + 1);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outer,
        start: `top ${HEADER_PX}px`,
        end: () => `+=${totalScroll()}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => measureTrack(),
        onUpdate: (self) => {
          const master = self.progress;

          // Effective viewport height = full viewport minus top+bottom
          // inset (the breathing room reserved for glow/descenders).
          const viewportHeight = viewport.clientHeight - VIEWPORT_INSET_Y * 2;
          const maxTranslate = Math.max(0, trackHeightRef.current - viewportHeight);
          gsap.set(track, { y: -maxTranslate * master });

          const newProgress = methodStages.map((_, i) => {
            const slotStart = i * STAGE_SLOT;
            const slotEnd = (i + 1) * STAGE_SLOT;
            if (master < slotStart) return 0;
            if (master >= slotEnd) return 1;
            return (master - slotStart) / STAGE_SLOT;
          });

          let newActive = -1;
          for (let i = N - 1; i >= 0; i--) {
            if ((newProgress[i] ?? 0) > 0) {
              newActive = i;
              break;
            }
          }

          setStageProgress(newProgress);
          setActiveIndex(newActive);
          setBuildComplete(master >= COMPLETE_START);
        },
      });
    }, outerRef);

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        measureTrack();
        ScrollTrigger.refresh();
      }, 120);
    });
    ro.observe(track);

    const refresh = () => {
      measureTrack();
      ScrollTrigger.refresh();
    };

    // Defer the load-triggered ScrollTrigger.refresh() to an idle callback —
    // firing it synchronously on "load" overlaps with peak GSAP + React +
    // Framer Motion init cost and contributes to the unattributed forced reflow
    // window. requestIdleCallback defers the layout pass until the main thread
    // is free. setTimeout fallback for Safari <16 which lacks rIC support.
    const onLoad = () => {
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(refresh, { timeout: 2000 });
      } else {
        setTimeout(refresh, 200);
      }
    };
    window.addEventListener("load", onLoad);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", refresh);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      ro.disconnect();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const panelH = `calc(100vh - ${HEADER_PX}px)`;

  return (
    <div
      ref={outerRef}
      className="relative overflow-hidden"
      style={{ height: panelH }}
      aria-label="HAFYN BUILDS delivery pipeline"
    >
      <CircuitBackground />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgb(62 123 250 / 0.06) 0%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto flex h-full max-w-6xl items-center gap-16 px-6 py-8 lg:px-12">
        {/* ── LEFT: clipping viewport + translating track ──
            Vertical padding (INSET) creates a breathing zone at the
            top and bottom of the clip region — that's why active-stage
            glows and heading descenders no longer get sliced.
            Horizontal padding gives node glows lateral breathing room
            without affecting the vertical scroll math. */}
        <div
          ref={viewportRef}
          className="relative h-full flex-1 overflow-hidden"
          style={{
            paddingTop: VIEWPORT_INSET_Y,
            paddingBottom: VIEWPORT_INSET_Y,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          <div ref={trackRef} className="will-change-transform">
            <div className="mb-8 lg:mb-10">
              <p
                className="mb-2 font-mono text-xs uppercase tracking-widest"
                style={{ color: "rgb(62 123 250 / 0.75)" }}
                aria-hidden="true"
              >
                Live Deploy
              </p>
              {/* leading-[1.15] + pb-2 protects descenders and bold-cap
                  curves (W, B) from being clipped at the viewport edge
                  even before the track has translated. */}
              <h2 className="pb-2 text-3xl font-bold leading-[1.15] text-text-primary sm:text-4xl lg:text-5xl">
                How we build.
              </h2>
            </div>

            <div role="list" aria-label="Delivery stages">
              {methodStages.map((stage, i) => (
                <div key={stage.id} role="listitem">
                  <StageNode
                    stage={stage}
                    progress={stageProgress[i] ?? 0}
                    isComplete={(stageProgress[i] ?? 0) >= 1}
                    isActive={activeIndex === i}
                    index={i}
                    isLast={i === N - 1}
                    reducedMotion={false}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 pb-8">
              <BuildComplete isVisible={buildComplete} reducedMotion={false} />
            </div>
          </div>
        </div>

        {/* ── RIGHT: status log — fixed in place, not part of the track ── */}
        <div className="w-80 shrink-0 xl:w-96" aria-label="Deployment status log">
          <StatusLog activeStageIndex={Math.max(0, activeIndex)} reducedMotion={false} />

          <div
            className="mt-6 flex items-center gap-2"
            style={{ opacity: buildComplete ? 0 : 0.4 }}
            aria-hidden="true"
          >
            <div className="h-px flex-1" style={{ backgroundColor: "rgb(42 42 49)" }} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Scroll to deploy
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "rgb(42 42 49)" }} />
          </div>
        </div>
      </div>
    </div>
  );
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
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    stageRefs.current.forEach((el) => el && stageObserver.observe(el));

    const completeObserver = new IntersectionObserver(
      ([entry]) => setBuildComplete(!!entry?.isIntersecting),
      { rootMargin: "-18% 0px -18% 0px", threshold: 0 }
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
          style={{ color: "rgb(62 123 250 / 0.75)" }}
          aria-hidden="true"
        >
          Live Deploy
        </p>
        <h2 className="pb-2 text-3xl font-bold leading-[1.15] text-text-primary sm:text-4xl">
          How we build.
        </h2>
      </div>

      <div className="relative mb-8">
        <StatusLog activeStageIndex={activeIndex} reducedMotion={false} compact />
      </div>

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
          style={{ color: "rgb(62 123 250 / 0.75)" }}
          aria-hidden="true"
        >
          Our Method
        </p>
        <h2 className="pb-2 text-3xl font-bold leading-[1.15] text-text-primary sm:text-4xl">
          How we build.
        </h2>
      </div>

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
