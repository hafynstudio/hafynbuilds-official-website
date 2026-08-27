"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { methodStages } from "@/data/method-stages";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

type StageStatus = "done" | "active" | "pending";

function getStatus(index: number, featuredIndex: number): StageStatus {
  if (index < featuredIndex) return "done";
  if (index === featuredIndex) return "active";
  return "pending";
}

const STATUS_COLOR: Record<StageStatus, string> = {
  done:    "34 197 94",
  active:  "62 123 250",
  pending: "245 158 11",
};

function rgba(status: StageStatus, alpha: number) {
  return `rgb(${STATUS_COLOR[status]} / ${alpha})`;
}

const KEYFRAMES = `
  @keyframes hb-breathe-blue {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.018); }
  }
  @keyframes hb-glow-drift {
    0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.14; }
    33%      { transform: translate(-42%,-58%) scale(1.1);  opacity: 0.20; }
    66%      { transform: translate(-58%,-44%) scale(0.95); opacity: 0.10; }
  }
  @keyframes hb-pulse-ring-blue {
    0%   { transform: scale(1);   opacity: 0.55; }
    100% { transform: scale(1.7); opacity: 0;    }
  }
  @keyframes hb-dot-pulse {
    0%,100% { opacity: 1;    }
    50%     { opacity: 0.25; }
  }
  @keyframes hb-sweep {
    0%   { transform: translateX(-120%); opacity: 0;   }
    15%  { opacity: 0.6; }
    85%  { opacity: 0.6; }
    100% { transform: translateX(420%);  opacity: 0;   }
  }
  .hb-breathe-blue {
    animation: hb-breathe-blue 5s ease-in-out infinite;
    will-change: transform;
    box-shadow: 0 0 0 1px rgb(62 123 250 / 0.52),
                0 0 27px rgb(62 123 250 / 0.18),
                0 0 56px rgb(62 123 250 / 0.07);
  }
  .hb-glow-drift   { animation: hb-glow-drift 8s ease-in-out infinite; }
  .hb-pulse-ring   { animation: hb-pulse-ring-blue 2.2s ease-out infinite; }
  .hb-dot-pulse    { animation: hb-dot-pulse 2s ease-in-out infinite; }
  .hb-sweep::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 0%,
      rgb(255 255 255 / 0.06) 45%,
      rgb(255 255 255 / 0.09) 50%,
      rgb(255 255 255 / 0.06) 55%,
      transparent 100%
    );
    animation: hb-sweep 1.4s cubic-bezier(0.22,1,0.36,1) forwards;
    pointer-events: none;
    border-radius: inherit;
  }
`;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function StatusIcon({ status, rm }: { status: StageStatus; rm: boolean }) {
  if (status === "done") {
    return (
      <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden="true">
        <path
          d="M3 7.5L5.5 10L11 4"
          fill="none"
          stroke={`rgb(${STATUS_COLOR.done})`}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "active") {
    return (
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {!rm && (
          <span className="hb-pulse-ring absolute inset-0 rounded-full border border-accent/50" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full bg-accent",
            !rm && "hb-dot-pulse"
          )}
        />
      </span>
    );
  }
  return (
    <span
      className="inline-flex h-2.5 w-2.5 rounded-full border"
      style={{
        borderColor: rgba("pending", 0.6),
        backgroundColor: rgba("pending", 0.15),
      }}
      aria-hidden="true"
    />
  );
}

interface NodeProps {
  stage: (typeof methodStages)[0];
  index: number;
  total: number;
  featuredIndex: number;
  sectionInView: boolean;
  rm: boolean;
}

function DesktopNode({
  stage,
  index,
  total,
  featuredIndex,
  sectionInView,
  rm,
}: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const [swept, setSwept] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);
  const status = getStatus(index, featuredIndex);
  const isActive = status === "active";
  const isLast = index === total - 1;

  function handleHoverStart() {
    setHovered(true);
    if (!rm) {
      setSwept(false);
      requestAnimationFrame(() => {
        setSweepKey((k) => k + 1);
        setSwept(true);
      });
    }
  }

  return (
    <div className="relative flex flex-1 flex-col items-center">

      <motion.div
        className={cn(
          "relative flex w-full max-w-[160px] cursor-default flex-col overflow-hidden rounded-xl border p-3.5",
          "bg-[#070910]",
          isActive && !rm && "hb-breathe-blue"
        )}
        style={{
          borderColor: isActive
            ? rgba("active", 0.45)
            : status === "done"
            ? rgba("done", 0.22)
            : rgba("pending", 0.22),
        }}
        animate={sectionInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.8, delay: index * 0.13, ease: EASE }}
        whileHover={
          rm ? {} : { y: -6, scale: 1.02, transition: { duration: 0.3, ease: EASE } }
        }
        onHoverStart={handleHoverStart}
        onHoverEnd={() => {
          setHovered(false);
          setSwept(false);
        }}
      >
        {isActive && !rm && (
          <div
            aria-hidden="true"
            className="hb-glow-drift pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-accent blur-2xl"
          />
        )}

        {swept && !rm && (
          <div
            key={sweepKey}
            aria-hidden="true"
            className="hb-sweep pointer-events-none absolute inset-0 rounded-xl"
          />
        )}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl"
          animate={{
            boxShadow:
              hovered && !rm
                ? `inset 0 0 0 1px ${rgba(status, 0.7)}, 0 0 22px ${rgba(status, 0.18)}`
                : "inset 0 0 0 1px transparent",
          }}
          transition={{ duration: 0.35, ease: EASE }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[1px]"
          animate={{
            background: `linear-gradient(to right, transparent, ${rgba(
              status,
              hovered ? 0.75 : isActive ? 0.55 : 0.35
            )}, transparent)`,
          }}
          transition={{ duration: 0.35 }}
        />

        <motion.div
          className="relative flex h-full flex-col"
          animate={{ y: (hovered || isActive) && !rm ? -3 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span
              className="font-mono text-[10px] font-semibold"
              style={{ color: `rgb(${STATUS_COLOR[status]})` }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <StatusIcon status={status} rm={rm} />
          </div>

          <h3
            className={cn(
              "text-sm leading-tight text-text-primary",
              isActive ? "font-bold" : "font-semibold"
            )}
          >
            {stage.name}
          </h3>

          <p
            className="mt-3 font-mono text-[9px] font-medium leading-tight"
            style={{ color: status === "active" ? "rgb(var(--color-accent-primary))" : `rgb(${STATUS_COLOR[status]} / 0.9)` }}
          >
            {status === "active"
              ? `[~] ${stage.statusLabel}`
              : `[✓] ${stage.statusLabel}`}
          </p>
        </motion.div>
      </motion.div>

      {!isLast && (
        <div
          aria-hidden="true"
          className="absolute hidden lg:block"
          style={{
            top: 56,
            left: "calc(80px)",
            right: 0,
            height: 1,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              animate={
                sectionInView
                  ? { width: index < featuredIndex ? "100%" : "0%" }
                  : { width: "0%" }
              }
              transition={{
                duration: rm ? 0 : 0.8,
                delay: rm ? 0 : index * 0.15 + 0.5,
                ease: EASE,
              }}
              style={{
                background:
                  index < featuredIndex
                    ? `linear-gradient(to right, rgb(${STATUS_COLOR.done}), rgb(${STATUS_COLOR.done} / 0.5))`
                    : "transparent",
              }}
            />
          </div>
        </div>
      )}

      <motion.p
        className="mt-2 hidden text-center text-[11px] leading-relaxed text-text-tertiary lg:block"
        style={{ maxWidth: 140 }}
        animate={sectionInView ? { opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: index * 0.13 + 0.32,
          ease: EASE,
        }}
      >
        {stage.shortDescription.split(" ").slice(0, 8).join(" ")}
        {stage.shortDescription.split(" ").length > 8 ? "…" : ""}
      </motion.p>
    </div>
  );
}

function MobileRow({
  stage,
  index,
  total,
  featuredIndex,
  sectionInView,
  rm,
}: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const [swept, setSwept] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);
  const status = getStatus(index, featuredIndex);
  const isActive = status === "active";
  const isLast = index === total - 1;

  function handleHoverStart() {
    setHovered(true);
    if (!rm) {
      setSwept(false);
      requestAnimationFrame(() => {
        setSweepKey((k) => k + 1);
        setSwept(true);
      });
    }
  }

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <motion.div
          className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-[#070910] font-mono text-[10px] font-bold"
          style={{
            borderColor: rgba(status, 0.5),
            color: `rgb(${STATUS_COLOR[status]})`,
            ...(isActive && !rm
              ? {
                  animation: "hb-breathe-blue 5s ease-in-out infinite",
                  willChange: "transform, box-shadow",
                }
              : {}),
          }}
          animate={sectionInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, delay: index * 0.13, ease: EASE }}
        >
          {String(index + 1).padStart(2, "0")}
          {isActive && !rm && (
            <span
              className="hb-pulse-ring absolute inset-0 rounded-full border border-accent/40"
              aria-hidden="true"
            />
          )}
        </motion.div>

        {!isLast && (
          <div
            className="relative mt-1 w-px flex-1 bg-border"
            style={{ minHeight: 28 }}
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{
                background:
                  index < featuredIndex
                    ? `linear-gradient(to bottom, rgb(${STATUS_COLOR.done}), transparent)`
                    : "transparent",
              }}
              animate={
                sectionInView && index < featuredIndex
                  ? { height: "100%" }
                  : { height: "0%" }
              }
              transition={{
                duration: rm ? 0 : 0.7,
                delay: rm ? 0 : index * 0.13 + 0.4,
                ease: EASE,
              }}
            />
          </div>
        )}
      </div>

      <motion.div
        className="relative mb-4 flex-1 cursor-default overflow-hidden rounded-xl border bg-[#070910] p-4"
        style={{ borderColor: rgba(status, 0.3) }}
        animate={sectionInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.75, delay: index * 0.13 + 0.07, ease: EASE }}
        whileHover={
          rm ? {} : { y: -3, scale: 1.01, transition: { duration: 0.3, ease: EASE } }
        }
        onHoverStart={handleHoverStart}
        onHoverEnd={() => {
          setHovered(false);
          setSwept(false);
        }}
      >
        {swept && !rm && (
          <div
            key={sweepKey}
            aria-hidden="true"
            className="hb-sweep pointer-events-none absolute inset-0 rounded-xl"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[1px]"
          style={{
            background: `linear-gradient(to right, transparent, ${rgba(status, 0.6)}, transparent)`,
          }}
        />

        <motion.div
          animate={{ y: (hovered || isActive) && !rm ? -2 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3
              className={cn(
                "text-sm leading-tight text-text-primary",
                isActive ? "font-bold" : "font-semibold"
              )}
            >
              {stage.name}
            </h3>
            <StatusIcon status={status} rm={rm} />
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            {stage.shortDescription}
          </p>
          <p
            className="mt-2.5 font-mono text-[9px] font-medium"
            style={{ color: `rgb(${STATUS_COLOR[status]} / 0.9)` }}
          >
            {status === "active"
              ? `[~] ${stage.statusLabel}`
              : `[✓] ${stage.statusLabel}`}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function MethodTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rm = usePrefersReducedMotion();

  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const sectionInView = useInView(sectionRef, { once: true, margin: "-60px" });

  if (methodStages.length === 0) return null;

  const sorted = [...methodStages].sort((a, b) => a.displayOrder - b.displayOrder);
  const featuredIndex = sorted.findIndex((s) => s.isFeatured);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border bg-bg-secondary px-4 py-20 sm:px-6 sm:py-24"
    >
      {!rm && <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(var(--color-accent-primary) / 0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-[10%] h-[420px] w-[420px] rounded-full bg-accent blur-3xl"
        animate={{ opacity: sectionInView ? 0.07 : 0.02 }}
        transition={{ duration: rm ? 0 : 1.8, ease: EASE }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-[5%] h-[300px] w-[300px] rounded-full bg-accent-glow blur-3xl"
        animate={{ opacity: sectionInView ? 0.04 : 0.01 }}
        transition={{ duration: rm ? 0 : 2, ease: EASE }}
      />

      <div className="relative mx-auto max-w-7xl">

        <div ref={headerRef} className="mb-14 sm:mb-16">
          <motion.p
            className="mb-3 font-mono text-xs tracking-widest text-accent sm:text-sm"
            animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            How We Work
          </motion.p>
          <motion.h2
            className="max-w-2xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-5xl"
            animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay: 0.09, ease: EASE }}
          >
            A process built to{" "}
            <span className="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
              remove doubt.
            </span>
          </motion.h2>
          <motion.p
            className="mt-4 max-w-[520px] text-sm text-text-secondary sm:text-base"
            animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          >
            Five stages. No surprises. Every deliverable defined before a single line gets written.
          </motion.p>
        </div>

        <div className="relative hidden lg:flex lg:items-start lg:gap-2">
          {sorted.map((stage, i) => (
            <DesktopNode
              key={stage.id}
              stage={stage}
              index={i}
              total={sorted.length}
              featuredIndex={featuredIndex}
              sectionInView={sectionInView}
              rm={rm}
            />
          ))}
        </div>

        <div className="lg:hidden">
          {sorted.map((stage, i) => (
            <MobileRow
              key={stage.id}
              stage={stage}
              index={i}
              total={sorted.length}
              featuredIndex={featuredIndex}
              sectionInView={sectionInView}
              rm={rm}
            />
          ))}
        </div>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between"
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.72, ease: EASE }}
        >
          <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
            <span className="text-success">✓</span>
            <span>Build Complete — every time.</span>
          </div>
          <Link
            href="/method"
            className="group inline-flex items-center gap-2 font-mono text-xs text-text-secondary transition-colors duration-300 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary sm:text-sm"
          >
            See the full process
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:brightness-125"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

