"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { RevealSection } from "@/components/ui/RevealSection";
import { featuredWork } from "@/data/featured-work";
import { ICON_MAP, ICON_STROKE_WIDTH } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { FeaturedWork } from "@/types/featured-work";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SPRING = { stiffness: 260, damping: 24, mass: 0.6 };
const SYNTAX = { blue: "79 193 255", green: "78 201 176", purple: "197 134 192", orange: "206 145 120", yellow: "220 220 170", gray: "106 153 85" } as const;
const TECH_CYCLE = [
  { label: "Next.js", color: SYNTAX.blue, comment: "// React framework" },
  { label: "TypeScript", color: SYNTAX.purple, comment: "// Type safety" },
  { label: "Framer Motion", color: SYNTAX.orange, comment: "// Animation layer" },
  { label: "GSAP", color: SYNTAX.green, comment: "// Scroll engine" },
  { label: "Tailwind CSS", color: SYNTAX.yellow, comment: "// Design tokens" },
] as const;
const CURRENCIES = [
  { symbol: "$", label: "USD" },
  { symbol: "€", label: "EUR" },
  { symbol: "£", label: "GBP" },
  { symbol: "₨", label: "PKR" },
  { symbol: "د.إ", label: "AED" },
  { symbol: "₹", label: "INR" },
] as const;
const PIPELINE_NODES = [
  { id: "src", label: "Source", x: 12, y: 20 },
  { id: "build", label: "Build", x: 38, y: 20 },
  { id: "test", label: "Test", x: 64, y: 20 },
  { id: "deploy", label: "Deploy", x: 90, y: 20 },
  { id: "monitor", label: "Monitor", x: 64, y: 65 },
  { id: "cdn", label: "CDN", x: 38, y: 65 },
] as const;
const PIPELINE_EDGES = [["src", "build"], ["build", "test"], ["test", "deploy"], ["deploy", "monitor"], ["monitor", "cdn"], ["cdn", "build"]] as const;
const DESIGN_NODES = [
  { id: "tokens", label: "Tokens", x: 50, y: 15 },
  { id: "colors", label: "Colors", x: 20, y: 42 },
  { id: "spacing", label: "Spacing", x: 80, y: 42 },
  { id: "motion", label: "Motion", x: 35, y: 72 },
  { id: "components", label: "Components", x: 65, y: 72 },
] as const;
const DESIGN_EDGES = [["tokens", "colors"], ["tokens", "spacing"], ["tokens", "motion"], ["tokens", "components"], ["colors", "components"], ["spacing", "motion"]] as const;
const KEYFRAMES = `@keyframes fw-float-a{0%,100%{transform:translateY(0px) rotate(0deg);opacity:0.7}33%{transform:translateY(-8px) rotate(3deg);opacity:1}66%{transform:translateY(4px) rotate(-2deg);opacity:0.8}}@keyframes fw-float-b{0%,100%{transform:translateY(0px) rotate(0deg);opacity:0.6}40%{transform:translateY(6px) rotate(-4deg);opacity:0.9}70%{transform:translateY(-5px) rotate(2deg);opacity:0.7}}@keyframes fw-float-c{0%,100%{transform:translateY(0px) scale(1);opacity:0.65}50%{transform:translateY(-6px) scale(1.05);opacity:1}}@keyframes fw-node-pulse{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}@keyframes fw-edge-flow{0%,100%{opacity:0.3}50%{opacity:0.9}}@keyframes fw-glow-breathe{0%,100%{opacity:0.06;transform:scale(1)}50%{opacity:0.13;transform:scale(1.08)}}@keyframes fw-sweep-once{0%{transform:translateX(-100%);opacity:0}20%{opacity:0.5}80%{opacity:0.5}100%{transform:translateX(200%);opacity:0}}@keyframes fw-counter-glow{0%,100%{text-shadow:none}50%{text-shadow:0 0 24px rgb(62 123 250 / 0.6),0 0 48px rgb(62 123 250 / 0.3)}}@keyframes fw-chip-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-3px)}}.fw-float-a{animation:fw-float-a var(--float-dur,4s) ease-in-out infinite}.fw-float-b{animation:fw-float-b var(--float-dur,5s) ease-in-out infinite}.fw-float-c{animation:fw-float-c var(--float-dur,3.5s) ease-in-out infinite}.fw-node-pulse{animation:fw-node-pulse 2.5s ease-in-out infinite}.fw-edge-flow{animation:fw-edge-flow 3s ease-in-out infinite}.fw-glow-breathe{animation:fw-glow-breathe 4s ease-in-out infinite}.fw-sweep-once{animation:fw-sweep-once 1.2s cubic-bezier(0.22,1,0.36,1) forwards}.fw-counter-glow{animation:fw-counter-glow 1.5s ease-in-out 3}.fw-chip-float{animation:fw-chip-float 3s ease-in-out infinite}`;

function AnimatedCounter({ target, suffix = "", inView, rm, className }: { target: number; suffix?: string; inView: boolean; rm: boolean; className?: string }) {
  const [count, setCount] = useState(0);
  const [glowing, setGlowing] = useState(false);
  const hasRun = useRef(false);
  useEffect(() => {
    if (!inView || hasRun.current || rm) return;
    hasRun.current = true;
    const duration = 1400;
    const steps = target;
    const stepDuration = duration / steps;
    let current = 0;
    const tick = () => {
      current += 1;
      setCount(current);
      if (current < target) { setTimeout(tick, stepDuration); } else { setGlowing(true); setTimeout(() => setGlowing(false), 4500); }
    };
    setTimeout(tick, 300);
  }, [inView, target, rm]);
  const displayValue = rm ? (inView ? target : 0) : count;
  return <span className={cn(className, glowing && !rm && "fw-counter-glow")}>{displayValue}{suffix}</span>;
}

function TechCycleTerminal({ inView, rm }: { inView: boolean; rm: boolean }) {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "done" | "exiting">("typing");
  const [typedLen, setTypedLen] = useState(0);
  const [swept, setSwept] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const runCycle = (index: number): void => {
      const tech = TECH_CYCLE[index];
      setPhase("typing");
      setTypedLen(0);
      setSwept(false);
      if (rm) { setTypedLen(tech.label.length); setPhase("done"); return; }
      let i = 0;
      const typeInterval = setInterval(() => {
        i++;
        setTypedLen(i);
        if (i >= tech.label.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            setPhase("done");
            setSwept(true);
            setTimeout(() => {
              setPhase("exiting");
              setTimeout(() => {
                const next = (index + 1) % TECH_CYCLE.length;
                setCycleIndex(next);
                runCycle(next);
              }, 400);
            }, 1800);
          }, 200);
        }
      }, 55);
    };
    runCycle(0);
  }, [inView, rm]);
  const tech = TECH_CYCLE[cycleIndex];
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-[#0d0d0f] p-4 font-mono text-sm">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-error/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <span className="ml-2 text-[10px] text-text-secondary">stack.ts</span>
      </div>
      <div className="mb-1 text-[11px]" style={{ color: `rgb(${SYNTAX.gray})` }}>{`// active stack`}</div>
      <div className="flex items-baseline gap-0 text-[13px]">
        <span style={{ color: `rgb(${SYNTAX.blue})` }}>import&nbsp;</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={`${cycleIndex}-${phase}`} animate={rm ? { opacity: 1 } : { opacity: 1, y: 0 }} exit={rm ? { opacity: 0 } : { opacity: 0, y: -4 }} transition={{ duration: rm ? 0 : 0.2 }} style={{ color: `rgb(${tech.color})` }} className="relative">
            {tech.label.slice(0, typedLen)}
            {phase === "typing" && <span className="animate-caret-blink ml-px inline-block h-[1em] w-[2px] translate-y-[1px] bg-current align-middle" />}
            {phase === "done" && swept && !rm && <span key="sweep" className="fw-sweep-once pointer-events-none absolute inset-0 rounded" style={{ background: `linear-gradient(90deg, transparent, rgb(${tech.color} / 0.3), transparent)` }} />}
          </motion.span>
        </AnimatePresence>
        <span style={{ color: `rgb(${SYNTAX.gray})` }}>&nbsp;{tech.comment}</span>
      </div>
      {/* Layout-stability: the "✓ Built" row is always rendered so its slot is
          permanently reserved; only opacity is animated. Mounting/unmounting it
          on phase === "done" used to change the terminal's layout height and
          shift the content below (chips, metric) — now the footprint is fixed
          from first paint. Enter is instant (duration 0), exit fades 0.25s —
          identical to the previous conditional mount behavior. */}
      <motion.div
        initial={false}
        animate={{ opacity: phase === "done" ? 1 : 0 }}
        transition={phase === "done" ? { duration: 0 } : { duration: rm ? 0 : 0.25 }}
        className="mt-2 flex items-center gap-1.5 text-[11px]"
        aria-hidden={phase !== "done"}
      >
        <span style={{ color: `rgb(${SYNTAX.green})` }}>✔</span>
        <span style={{ color: `rgb(${SYNTAX.green})` }}>Built</span>
      </motion.div>
      <div className="mt-3 flex items-center gap-1">
        {TECH_CYCLE.map((_, i) => <span key={i} className="h-1 rounded-full transition-all duration-500" style={{ width: i === cycleIndex ? 16 : 4, background: i === cycleIndex ? `rgb(${tech.color})` : "rgb(var(--color-border))" }} />)}
      </div>
    </div>
  );
}

function PipelineVisual({ inView, rm }: { inView: boolean; rm: boolean }) {
  const [activeNode, setActiveNode] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current || rm) return;
    started.current = true;
    const interval = setInterval(() => { setActiveNode((prev) => (prev + 1) % PIPELINE_NODES.length); }, 900);
    return () => clearInterval(interval);
  }, [inView, rm]);
  const nodePos: Record<string, { x: number; y: number }> = {};
  PIPELINE_NODES.forEach((n) => { nodePos[n.id] = { x: n.x, y: n.y }; });
  return (
    <div className="relative h-full min-h-[160px] w-full overflow-hidden rounded-lg border border-border/50 bg-[#08080b] p-3">
      <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-text-secondary">Build Pipeline</p>
      <svg viewBox="0 0 100 90" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        {PIPELINE_EDGES.map(([from, to]) => {
          const a = nodePos[from]; const b = nodePos[to];
          if (!a || !b) return null;
          return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgb(var(--color-border))" strokeWidth="0.4" strokeDasharray="2 1" className={!rm ? "fw-edge-flow" : ""} style={{ animationDelay: `${PIPELINE_EDGES.findIndex(([f, t]) => f === from && t === to) * 0.5}s` }} />;
        })}
        {PIPELINE_NODES.map((node, i) => {
          const isActive = activeNode === i;
          return (
            <g key={node.id}>
              {isActive && !rm && <circle cx={node.x} cy={node.y} r={4.5} fill="none" stroke="rgb(var(--color-accent-primary))" strokeWidth="0.5" opacity={0.5} className="fw-node-pulse" />}
              <circle cx={node.x} cy={node.y} r={2.5} fill={isActive ? "rgb(var(--color-accent-primary))" : "rgb(var(--color-surface-raised))"} stroke={isActive ? "rgb(var(--color-accent-primary))" : "rgb(var(--color-border))"} strokeWidth="0.4" className={!rm ? "fw-node-pulse" : ""} style={{ animationDelay: `${i * 0.4}s` }} />
              <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize="4" fill={isActive ? "rgb(var(--color-accent-primary))" : "rgb(var(--color-text-tertiary))"} className="font-mono">{node.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CurrencyFloatVisual({ rm }: { rm: boolean }) {
  const floatClasses = ["fw-float-a", "fw-float-b", "fw-float-c", "fw-float-a", "fw-float-b", "fw-float-c"];
  const delays = ["0s", "0.7s", "1.4s", "0.35s", "1.1s", "1.8s"];
  const durations = ["4s", "5s", "3.5s", "4.5s", "3.8s", "5.2s"];
  const positions = [{ top: "10%", left: "8%" }, { top: "15%", right: "10%" }, { top: "45%", left: "5%" }, { top: "50%", right: "8%" }, { top: "75%", left: "20%" }, { top: "72%", right: "18%" }];
  return (
    <div className="relative h-full min-h-[140px] w-full overflow-hidden rounded-lg border border-border/50 bg-[#08080b]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 opacity-20">
          <svg viewBox="0 0 40 16" className="h-3 w-10 text-accent" fill="none">
            <path d="M0 4h32l-6-3m6 3l-6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M40 12H8l6-3M8 12l6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {CURRENCIES.map((cur, i) => (
        <div key={cur.label} aria-hidden="true" className={cn("absolute font-mono font-bold", !rm && floatClasses[i])} style={{ ...positions[i], fontSize: i % 3 === 0 ? "1.5rem" : i % 3 === 1 ? "1.1rem" : "0.9rem", color: i % 2 === 0 ? "rgb(var(--color-accent-primary) / 0.94)" : "rgb(var(--color-accent-glow) / 0.72)", animationDelay: delays[i], ["--float-dur" as never]: durations[i] }}>{cur.symbol}</div>
      ))}
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {CURRENCIES.map((cur) => <span key={cur.label} className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[9px] text-text-secondary">{cur.label}</span>)}
      </div>
    </div>
  );
}

function DesignNetworkVisual({ inView, rm }: { inView: boolean; rm: boolean }) {
  const [activeEdge, setActiveEdge] = useState(0);
  useEffect(() => {
    if (!inView || rm) return;
    const interval = setInterval(() => { setActiveEdge((prev) => (prev + 1) % DESIGN_EDGES.length); }, 700);
    return () => clearInterval(interval);
  }, [inView, rm]);
  const nodePos: Record<string, { x: number; y: number }> = {};
  DESIGN_NODES.forEach((n) => { nodePos[n.id] = { x: n.x, y: n.y }; });
  return (
    <div className="relative h-full min-h-[140px] w-full overflow-hidden rounded-lg border border-border/50 bg-[#08080b] p-2">
      <svg viewBox="0 0 100 90" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        {DESIGN_EDGES.map(([from, to], i) => {
          const a = nodePos[from]; const b = nodePos[to];
          if (!a || !b) return null;
          const isActive = activeEdge === i;
          return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isActive ? "rgb(var(--color-accent-glow))" : "rgb(var(--color-border))"} strokeWidth={isActive ? "0.8" : "0.3"} strokeLinecap="round" style={{ transition: "stroke 0.3s, stroke-width 0.3s" }} />;
        })}
        {DESIGN_NODES.map((node, i) => {
          const isCenter = node.id === "tokens";
          return (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r={isCenter ? 4 : 2.8} fill={isCenter ? "rgb(var(--color-accent-primary) / 0.2)" : "rgb(var(--color-surface-raised))"} stroke={isCenter ? "rgb(var(--color-accent-primary))" : "rgb(var(--color-border-hover))"} strokeWidth="0.5" className={!rm && isCenter ? "fw-node-pulse" : ""} style={{ animationDelay: `${i * 0.3}s` }} />
              <text x={node.x} y={node.y + 7} textAnchor="middle" fontSize={isCenter ? "5" : "4"} fill={isCenter ? "rgb(var(--color-accent-primary))" : "rgb(var(--color-text-tertiary))"}>{node.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StatusDot({ status }: { status: FeaturedWork["status"] }) {
  const colors = { live: "bg-success", "in-progress": "bg-accent", completed: "bg-text-secondary" };
  const showPing = status !== "completed";
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      {showPing && <span className={cn("absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full opacity-60", colors[status])} />}
      <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", colors[status])} />
    </span>
  );
}

const STATUS_LABEL: Record<FeaturedWork["status"], string> = { live: "LIVE", "in-progress": "IN PROGRESS", completed: "COMPLETED" };
const STATUS_TEXT: Record<FeaturedWork["status"], string> = { live: "text-success", "in-progress": "text-accent", completed: "text-text-secondary" };

function MagneticChip({ label, rm, hasFinePointer, delay }: { label: string; rm: boolean; hasFinePointer: boolean; delay: number }) {
  const chipRef = useRef<HTMLSpanElement>(null);
  // Cached DOMRect — populated once on mouseenter, read-only in mousemove.
  // Prevents a synchronous forced layout flush on every mousemove tick
  // (same fix applied sitewide in BUG-009 for Button, TiltCard, PortraitCard).
  const rectCacheRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, EASE_SPRING);
  const sy = useSpring(y, EASE_SPRING);
  function handleMouseEnter() {
    if (!hasFinePointer || rm || !chipRef.current) return;
    rectCacheRef.current = chipRef.current.getBoundingClientRect();
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!hasFinePointer || rm || !rectCacheRef.current) return;
    const rect = rectCacheRef.current;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    x.set(dx); y.set(dy);
  }
  function handleMouseLeave() { rectCacheRef.current = null; x.set(0); y.set(0); }
  return <motion.span ref={chipRef} style={{ x: hasFinePointer && !rm ? sx : 0, y: hasFinePointer && !rm ? sy : 0, animationDelay: `${delay}s` }} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={cn("inline-block cursor-default rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-text-secondary transition-colors duration-200 hover:border-border-hover hover:text-text-primary", !rm && !hasFinePointer && "fw-chip-float")}>{label}</motion.span>;
}

function HeroWorkCard({ work, rm, hasFinePointer }: { work: FeaturedWork; rm: boolean; hasFinePointer: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const [swept, setSwept] = useState(false);
  useEffect(() => {
    if (inView && !rm && !swept) {
      setTimeout(() => setSwept(true), 600);
      setTimeout(() => setSwept(false), 2000);
    }
  }, [inView, rm, swept]);
  const metricTarget = parseInt(work.metric.value.replace(/\D/g, ""), 10) || 0;
  const metricSuffix = work.metric.value.replace(/\d/g, "");
  return (
    <motion.div ref={cardRef} animate={inView ? { opacity: 1, y: 0, filter: "none" } : {}} transition={{ duration: 0.9, ease: EASE }} className="relative overflow-hidden rounded-2xl border border-border bg-[#07070a]" style={{ boxShadow: "0 0 0 1px rgb(255 255 255 / 0.04) inset, 0 32px 80px rgb(0 0 0 / 0.6)" }}>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.06] mix-blend-screen"><filter id="fw-grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#fw-grain)" /></svg>
      <div aria-hidden="true" className={cn("pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent blur-3xl", !rm && "fw-glow-breathe")} />
      <div aria-hidden="true" className={cn("pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accent-glow blur-3xl", !rm && "fw-glow-breathe")} style={{ animationDelay: "2s" }} />
      <div className="absolute inset-x-0 top-0 z-[2] h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />
      {swept && !rm && <div aria-hidden="true" className="fw-sweep-once pointer-events-none absolute inset-0 z-[3]" style={{ background: "linear-gradient(105deg, transparent 0%, rgb(255 255 255 / 0.04) 45%, rgb(255 255 255 / 0.07) 50%, rgb(255 255 255 / 0.04) 55%, transparent 100%)" }} />}
      <div className="relative z-[4] p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className={cn("flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest", STATUS_TEXT[work.status])}><StatusDot status={work.status} />{STATUS_LABEL[work.status]}</span>
          <span className="rounded-full border border-border px-3 py-0.5 font-mono text-[10px] text-text-secondary">{work.tag}</span>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="flex flex-1 flex-col">
            <motion.h3 animate={inView ? { opacity: 1, y: 0, letterSpacing: "0em", filter: "none" } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="text-2xl font-bold text-text-primary tracking-normal sm:text-3xl lg:text-4xl">{work.name}</motion.h3>
            <motion.p animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.35, ease: EASE }} className="mt-4 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">{work.description}</motion.p>
            <motion.div animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.5, ease: EASE }} className="mt-6"><TechCycleTerminal inView={inView} rm={rm} /></motion.div>
            <motion.div animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.65 }} className="mt-4 flex flex-wrap gap-2">{work.techStack.map((tech, i) => <MagneticChip key={tech} label={tech} rm={rm} hasFinePointer={hasFinePointer} delay={i * 0.6} />)}</motion.div>
            <motion.div animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.75, ease: EASE }} className="mt-8 flex items-end gap-4 border-t border-border pt-6"><div><AnimatedCounter target={metricTarget} suffix={metricSuffix} inView={inView} rm={rm} className="font-mono text-5xl font-bold text-text-primary sm:text-6xl" /><p className="mt-1 font-mono text-xs text-text-secondary">{work.metric.label}</p></div></motion.div>
          </div>
          <motion.div animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.4, ease: EASE }} className="flex w-full flex-col lg:w-72 lg:shrink-0">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-secondary">Architecture</p>
            <div className="flex-1"><PipelineVisual inView={inView} rm={rm} /></div>
            <div className="mt-4 grid grid-cols-3 gap-2">{["SSG", "ISR", "Edge"].map((label) => <div key={label} className="flex flex-col items-center rounded-lg border border-border bg-surface/50 py-2"><span className="font-mono text-[10px] font-bold text-accent">{label}</span><span className="mt-0.5 font-mono text-[9px] text-text-secondary">enabled</span></div>)}</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StandardWorkCard({ work, rm, hasFinePointer }: { work: FeaturedWork; rm: boolean; hasFinePointer: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const isPricing = work.id === "hafyn-investment-engine";
  const isDesign = work.id === "hafyn-design-system";
  const metricTarget = parseInt(work.metric.value.replace(/\D/g, ""), 10) || 0;
  const metricSuffix = work.metric.value.replace(/\d/g, "");
  return (
    <motion.div ref={cardRef} animate={inView ? { opacity: 1, y: 0, filter: "none" } : {}} transition={{ duration: 0.8, ease: EASE }} className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-[#07070a]" style={{ boxShadow: "0 0 0 1px rgb(255 255 255 / 0.04) inset, 0 16px 48px rgb(0 0 0 / 0.5)" }}>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.05] mix-blend-screen"><filter id={`fw-grain-${work.id}`}><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter={`url(#fw-grain-${work.id})`} /></svg>
      <div aria-hidden="true" className={cn("pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl", isPricing ? "bg-accent" : "bg-accent-glow", !rm && "fw-glow-breathe")} />
      <div className="absolute inset-x-0 top-0 z-[2] h-[1px]" style={{ background: work.status === "live" ? "linear-gradient(to right, transparent, rgb(34 197 94 / 0.5), transparent)" : "linear-gradient(to right, transparent, rgb(62 123 250 / 0.5), transparent)" }} />
      <div className="relative z-[4] flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          {(() => { const Icon = ICON_MAP[work.icon]; return Icon ? <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface"><Icon className="h-5 w-5 text-accent" strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" /></div> : null; })()}
          <span className={cn("flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest", STATUS_TEXT[work.status])}><StatusDot status={work.status} />{STATUS_LABEL[work.status]}</span>
        </div>
        <motion.h3 animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15, ease: EASE }} className="text-lg font-bold text-text-primary">{work.name}</motion.h3>
        <motion.p animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.25 }} className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{work.description}</motion.p>
        <motion.div animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7, delay: 0.35, ease: EASE }} className="mt-4 h-36">{isPricing && <CurrencyFloatVisual rm={rm} />}{isDesign && <DesignNetworkVisual inView={inView} rm={rm} />}</motion.div>
        <div className="mt-4 flex flex-wrap gap-1.5">{work.techStack.slice(0, 3).map((tech, i) => <MagneticChip key={tech} label={tech} rm={rm} hasFinePointer={hasFinePointer} delay={i * 0.8} />)}{work.techStack.length > 3 && <span className="inline-block rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-text-secondary">+{work.techStack.length - 3}</span>}</div>
        <div className="mt-5 flex items-end justify-between border-t border-border pt-4"><div><AnimatedCounter target={metricTarget} suffix={metricSuffix} inView={inView} rm={rm} className="font-mono text-3xl font-bold text-text-primary" /><p className="mt-0.5 font-mono text-[10px] text-text-secondary">{work.metric.label}</p></div></div>
      </div>
    </motion.div>
  );
}

/**
 * SSR-safe subscription to `(pointer: fine)` — i.e. "does this device have
 * a mouse/trackpad, not just touch." Used to gate magnetic-hover chip
 * behavior (desktop only; mobile gets a lighter float animation instead).
 *
 * Uses useSyncExternalStore rather than useState+useEffect because this is
 * exactly the case it exists for: subscribing to an external browser API.
 * getServerSnapshot always returns false, so server HTML and the client's
 * first hydration pass agree (both render the non-magnetic variant); the
 * real value syncs in immediately after via React's own store-subscription
 * mechanism, with no manual setState-in-effect call and no extra render
 * pass to reason about.
 */
function subscribeFinePointer(callback: () => void) {
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getFinePointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}
function getFinePointerServerSnapshot() {
  return false;
}
function useHasFinePointer() {
  return useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot
  );
}
export function FeaturedWork() {
  const hasFinePointer = useHasFinePointer();
  const rm = usePrefersReducedMotion();
  if (featuredWork.length === 0) return null;
  const sorted = [...featuredWork].sort((a, b) => a.displayOrder - b.displayOrder);
  const [heroWork, ...restWork] = sorted;
  return (
    <section className="relative overflow-hidden bg-bg-primary px-4 py-24 sm:px-6">
      {!rm && <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgb(var(--color-accent-primary) / 0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgb(var(--color-accent-glow) / 0.03) 0%, transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl">
        <RevealSection className="mb-12 max-w-2xl"><p className="mb-3 font-mono text-sm text-accent">Proof of Work</p><h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Proof, not promises.</h2><p className="mt-4 text-base text-text-secondary">Real, shipped work — including the systems running this website right now. Every entry is an internal build, tagged honestly. Client case studies follow as they ship.</p></RevealSection>
        <div className="mb-6"><HeroWorkCard work={heroWork} rm={rm} hasFinePointer={hasFinePointer} /></div>
        {restWork.length > 0 && <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{restWork.map((work) => <StandardWorkCard key={work.id} work={work} rm={rm} hasFinePointer={hasFinePointer} />)}</div>}
      </div>
    </section>
  );
}


