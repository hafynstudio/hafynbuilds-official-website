"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { founder } from "@/data/founder";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Signature } from "@/components/ui/Signature";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TILT_SPRING = { stiffness: 150, damping: 26, mass: 0.8 };
const MAX_TILT = 4;

const DESKTOP_PORTRAIT_W = 370;
const DESKTOP_PORTRAIT_H = 476;
const MOBILE_PORTRAIT_W = 260;
const MOBILE_PORTRAIT_H = 320;

// Signature display heights -- passed to the shared Signature component
// (components/ui/Signature.tsx, promoted Phase 13 / Decision D29).
const SIG_H_DESKTOP = 88;
const SIG_H_MOBILE = 64;

const STICKY_TOP_OFFSET = "calc(var(--header-height) + 2rem)";

// ─── KEYFRAMES ────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes ft-float {
    0%,100% { transform: translateY(0px);  }
    50%      { transform: translateY(-4px); }
  }
  @keyframes ft-glow-breathe {
    0%,100% { opacity: 0.45; transform: scale(1);    }
    50%      { opacity: 0.72; transform: scale(1.06); }
  }
  @keyframes ft-ring-pulse {
    0%,100% { opacity: 0.35; transform: scale(1);    }
    50%      { opacity: 0.12; transform: scale(1.025);}
  }
  @keyframes ft-sweep {
    0%   { transform: translateX(-120%); opacity: 0;    }
    20%  { opacity: 0.06; }
    80%  { opacity: 0.06; }
    100% { transform: translateX(320%);  opacity: 0;    }
  }
  .ft-float        { animation: ft-float        8s ease-in-out infinite; will-change: transform; }
  .ft-glow-breathe { animation: ft-glow-breathe 7s ease-in-out infinite; will-change: transform, opacity; }
  .ft-ring-pulse   { animation: ft-ring-pulse   5s ease-in-out infinite; will-change: transform, opacity; }
  .ft-sweep        { animation: ft-sweep        10s ease-in-out 3s infinite; }
`;

// ─── PORTRAIT CARD ────────────────────────────────────────────────────────────

function PortraitCard({
  inView,
  rm,
  mobile = false,
}: {
  inView: boolean;
  rm: boolean;
  mobile?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, TILT_SPRING);
  const sy = useSpring(my, TILT_SPRING);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (rm || mobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set(-((e.clientY - rect.top) / rect.height - 0.5));
    mx.set(mx.get() * MAX_TILT * 2);
    my.set(my.get() * MAX_TILT * 2);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  const W = mobile ? MOBILE_PORTRAIT_W : DESKTOP_PORTRAIT_W;
  const H = mobile ? MOBILE_PORTRAIT_H : DESKTOP_PORTRAIT_H;

  return (
    <motion.div
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: EASE }}
      className={cn("relative flex", mobile ? "justify-center" : "justify-start")}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute rounded-full", !rm && "ft-glow-breathe")}
        style={{
          width: W * 0.85,
          height: H * 0.85,
          top: H * 0.08,
          left: mobile ? "50%" : W * 0.08,
          transform: mobile ? "translateX(-50%)" : undefined,
          background: "radial-gradient(circle, rgb(62 123 250 / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* Outer pulse ring — desktop only */}
      {!mobile && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute rounded-[26px] border border-accent/12",
            !rm && "ft-ring-pulse"
          )}
          style={{ width: W + 20, height: H + 20, top: -10, left: -10 }}
        />
      )}

      {/* Float + tilt wrapper */}
      <div className={cn("relative", !mobile && !rm && "ft-float")}>
        <motion.div
          ref={cardRef}
          style={{
            rotateY: !mobile && !rm ? sx : 0,
            rotateX: !mobile && !rm ? sy : 0,
            transformPerspective: 1000,
          }}
          animate={{ scale: hovered && !rm && !mobile ? 1.01 : 1 }}
          transition={{ scale: { duration: 0.4, ease: EASE } }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => !mobile && setHovered(true)}
          onMouseLeave={!mobile ? handleMouseLeave : undefined}
          className="relative will-change-transform"
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: W,
              height: H,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow:
                hovered && !rm && !mobile
                  ? "0 0 0 1px rgba(62,123,250,0.28), 0 28px 72px rgba(0,0,0,0.68), 0 0 40px rgba(62,123,250,0.12)"
                  : "0 0 0 1px rgba(62,123,250,0.08), 0 20px 56px rgba(0,0,0,0.58)",
              transition: "box-shadow 0.45s ease",
              background: "#050508",
            }}
          >
            {/* Portrait */}
            {founder.photoUrl && (
              <Image
                src={founder.photoUrl}
                alt={`${founder.name} — ${founder.title}`}
                fill
                className="object-cover object-top"
                sizes={mobile ? "260px" : "370px"}
                priority
                fetchPriority="high"
              />
            )}

            {/* Glass inner highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: 20,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.045) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.018) 100%)",
              }}
            />

            {/* Diagonal reflection sweep */}
            {!rm && (
              <div
                aria-hidden="true"
                className="ft-sweep pointer-events-none absolute inset-y-0"
                style={{
                  width: "52%",
                  left: "-52%",
                  background:
                    "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.06) 50%, transparent 75%)",
                }}
              />
            )}

            {/* Bottom gradient */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0"
              style={{
                height: H * 0.4,
                background:
                  "linear-gradient(to top, rgba(5,5,8,0.96) 0%, rgba(5,5,8,0.52) 48%, transparent 100%)",
              }}
            />

            {/* FOUNDER vertical badge */}
            {!mobile && (
              <div
                className="absolute left-3 top-1/2"
                style={{
                  writingMode: "vertical-rl",
                  transform: "translateY(-50%) rotate(180deg)",
                }}
              >
                <span className="select-none font-mono text-[9px] font-bold tracking-[0.3em] text-accent">
                  FOUNDER
                </span>
              </div>
            )}

            {/* Single accent dot */}
            <div
              aria-hidden="true"
              className="absolute"
              style={{ bottom: mobile ? 58 : 72, left: mobile ? 13 : 15 }}
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-accent" />
            </div>

            {/* Bottom glass capsule */}
            <div className="absolute inset-x-2.5 bottom-2.5">
              <div
                className="flex items-center gap-2 rounded-[10px] px-3 py-2 backdrop-blur-sm transition-all duration-200 hover:brightness-110"
                style={{
                  background: "rgba(8,12,28,0.80)",
                  border: "1px solid rgba(62,123,250,0.20)",
                }}
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-2.5 w-2.5 shrink-0 text-accent"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.5 2L4 9h5l-1.5 5L14 7H9L9.5 2z" />
                </svg>
                <span className="font-mono text-[10px] text-white/72">
                  Building systems that outlive trends.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── ACCENT DIVIDER ───────────────────────────────────────────────────────────

function AccentDivider({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        mobile ? "my-5 justify-center" : "my-5"
      )}
    >
      <span
        aria-hidden="true"
        className="h-px flex-1"
        style={{
          maxWidth: 180,
          background:
            "linear-gradient(to right, transparent 0%, rgb(62 123 250 / 0.55) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: "rgb(62 123 250)", opacity: 0.8 }}
      />
      <span
        aria-hidden="true"
        className="h-px flex-1"
        style={{
          maxWidth: 180,
          background:
            "linear-gradient(to left, transparent 0%, rgb(62 123 250 / 0.55) 100%)",
        }}
      />
    </div>
  );
}

// ─── FOUNDER CTA ──────────────────────────────────────────────────────────────

function FounderCTA() {
  return (
    <Link
      href="/founder"
      className={cn(
        "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl",
        "border border-border bg-surface/40 px-5 py-3 font-medium text-sm text-text-primary",
        "backdrop-blur-sm transition-all duration-200 ease-out",
        "hover:border-accent/30 hover:bg-accent/[0.07]",
        "hover:shadow-[0_0_0_1px_rgba(62,123,250,0.12),0_6px_24px_rgba(62,123,250,0.10),inset_0_1px_0_rgba(255,255,255,0.05)]",
        "active:scale-[0.982] active:duration-[60ms]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.035) 50%, transparent 80%)",
        }}
      />
      <span className="relative">Read our philosophy</span>
      <ArrowRight
        size={14}
        strokeWidth={ICON_STROKE_WIDTH}
        aria-hidden="true"
        className="relative transition-transform duration-200 group-hover:translate-x-[3px]"
      />
    </Link>
  );
}

// ─── CONTENT PANEL ────────────────────────────────────────────────────────────

function ContentPanel({
  inView,
  rm,
  mobile = false,
}: {
  inView: boolean;
  rm: boolean;
  mobile?: boolean;
}) {
  const headingLines = [
    { white: "We don\u2019t build software", blue: null },
    { white: "to launch it. We build", blue: null },
    { white: "systems that still create", blue: null },
    { white: "value ", blue: "years later." },
  ] as const;

  // ── MOBILE ────────────────────────────────────────────────────────────
  if (mobile) {
    return (
      <div className="flex flex-col items-center px-5 pt-6 text-center">
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
          className="mb-4 flex items-center justify-center gap-2.5"
        >
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.17em] text-accent">
            A Note From Our Founder
          </span>
        </motion.div>

        <h2
          className="text-[1.85rem] font-bold leading-[1.01] tracking-tight sm:text-4xl"
          aria-label="We don't build software to launch it. We build systems that still create value years later."
        >
          {headingLines.map((line, i) => (
            <motion.span
              key={i}
              className="block"
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.14 + i * 0.08, ease: EASE }}
            >
              <span className="text-text-primary">{line.white}</span>
              {line.blue && <span className="text-accent">{line.blue}</span>}
            </motion.span>
          ))}
        </h2>

        <motion.div
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          style={{ originX: 0.5, width: "100%" }}
        >
          <AccentDivider mobile />
        </motion.div>

        <motion.p
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.58, ease: EASE }}
          className="max-w-[340px] text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]"
        >
          At HAFYN, we believe real impact is not measured at launch — it&apos;s
          measured in years of reliability, scalability, and trust our systems
          continue to deliver.
        </motion.p>

        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.70, ease: EASE }}
          className="mt-6 flex flex-col items-center gap-4"
        >
          <div className="flex items-center justify-center gap-5 flex-wrap">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-sm font-bold text-text-primary">{founder.name}</span>
              <span className="text-xs font-medium text-accent">{founder.title}</span>
              <span className="font-mono text-[9px] tracking-widest text-text-tertiary">
                HAFYN BUILDS
              </span>
            </div>
            <Signature heightPx={SIG_H_MOBILE} />
          </div>
        </motion.div>

        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.82, ease: EASE }}
          className="mt-6 flex justify-center"
        >
          <FounderCTA />
        </motion.div>
      </div>
    );
  }

  // ── DESKTOP ───────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col justify-between pl-10 xl:pl-12"
      style={{ minHeight: DESKTOP_PORTRAIT_H }}
    >
      <div>
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
          className="mb-4 flex items-center gap-2.5"
        >
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.17em] text-accent">
            A Note From Our Founder
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
          <ArrowRight
            size={10}
            strokeWidth={ICON_STROKE_WIDTH}
            className="text-accent"
            aria-hidden="true"
          />
        </motion.div>

        <h2
          className="text-[2.6rem] font-bold leading-[1.01] tracking-tight xl:text-[2.9rem]"
          aria-label="We don't build software to launch it. We build systems that still create value years later."
        >
          {headingLines.map((line, i) => (
            <motion.span
              key={i}
              className="block"
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.14 + i * 0.08, ease: EASE }}
            >
              <span className="text-text-primary">{line.white}</span>
              {line.blue && <span className="text-accent">{line.blue}</span>}
            </motion.span>
          ))}
        </h2>

        <motion.div
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          style={{ originX: 0 }}
        >
          <AccentDivider />
        </motion.div>

        <motion.p
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.58, ease: EASE }}
          className="max-w-[420px] text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]"
        >
          At HAFYN, we believe real impact is not measured at launch — it&apos;s
          measured in years of reliability, scalability, and trust our systems
          continue to deliver.
        </motion.p>
      </div>

      <div>
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.70, ease: EASE }}
          className="flex flex-row flex-wrap items-center gap-x-8 gap-y-3"
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 block h-8 w-[2.5px] shrink-0 rounded-full bg-accent" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-text-primary">{founder.name}</span>
              <span className="text-xs font-medium text-accent">{founder.title}</span>
              <span className="font-mono text-[9px] tracking-widest text-text-tertiary">
                HAFYN BUILDS
              </span>
            </div>
          </div>

          <Signature heightPx={SIG_H_DESKTOP} />
        </motion.div>

        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.82, ease: EASE }}
          className="mt-6"
        >
          <FounderCTA />
        </motion.div>
      </div>
    </div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────

export function FounderTeaser() {
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const rm = usePrefersReducedMotion();

  const mobileInView = useInView(mobileRef, { once: true, margin: "-50px" });
  const desktopInView = useInView(desktopRef, { once: true, margin: "-60px" });

  return (
    <section className="relative overflow-hidden border-t border-border bg-black">
      {!rm && <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 60% at 18% 50%, rgb(62 123 250 / 0.07) 0%, transparent 65%)",
        }}
      />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.02] mix-blend-screen"
      >
        <filter id="ft-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ft-noise)" />
      </svg>

      <div ref={mobileRef} className="block lg:hidden px-5 pb-14 pt-10">
        <div className="flex flex-col items-center">
          <div className="mb-8 w-full max-w-[280px]">
            <PortraitCard inView={mobileInView} rm={rm} mobile />
          </div>
          <ContentPanel inView={mobileInView} rm={rm} mobile />
        </div>
      </div>

      <div className="hidden lg:block">
        <div
          ref={desktopRef}
          className="relative mx-auto max-w-[1360px] px-10 py-14 xl:px-14 xl:py-16"
        >
          <div className="grid grid-cols-2 items-start gap-16">
            <div
              className="sticky self-start justify-self-end"
              style={{ top: STICKY_TOP_OFFSET }}
            >
              <PortraitCard inView={desktopInView} rm={rm} mobile={false} />
            </div>

            <ContentPanel inView={desktopInView} rm={rm} mobile={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
