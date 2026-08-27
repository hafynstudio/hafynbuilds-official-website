"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { methodStages } from "@/data/method-stages";
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
const VIEWPORT_INSET_Y = 40;

export function AnimatedPipeline() {
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
    const trackElement = track;

    function measureTrack() {
      trackHeightRef.current = trackElement.scrollHeight;
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
          const viewportHeight = viewport.clientHeight - VIEWPORT_INSET_Y * 2;
          const maxTranslate = Math.max(
            0,
            trackHeightRef.current - viewportHeight
          );
          gsap.set(trackElement, { y: -maxTranslate * master });

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
    ro.observe(trackElement);

    const refresh = () => {
      measureTrack();
      ScrollTrigger.refresh();
    };

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
              <h1 className="pb-2 text-3xl font-bold leading-[1.15] text-text-primary sm:text-4xl lg:text-5xl">
                How we build.
              </h1>
            </div>

            <h2 className="sr-only">Five-stage delivery pipeline</h2>

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

        <div className="w-80 shrink-0 xl:w-96" aria-label="Deployment status log">
          <StatusLog
            key={`desktop-${Math.max(0, activeIndex)}`}
            activeStageIndex={Math.max(0, activeIndex)}
            reducedMotion={false}
          />

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
