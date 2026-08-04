"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { EASE_OUT_EXPO, EASE_OUT_QUART } from "@/lib/motion";

interface BuildCompleteProps {
  isVisible: boolean;
  reducedMotion: boolean;
}

/**
 * The "✓ Build Complete" payoff moment at the end of the pipeline scroll.
 * PRD §2.2.5 explicitly calls this out as the emotional climax of the page.
 * Full-width glow, animated checkmark draw-in, triumphant typography.
 */
export function BuildComplete({ isVisible, reducedMotion }: BuildCompleteProps) {
  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={
        reducedMotion
          ? { opacity: isVisible ? 1 : 0 }
          : isVisible
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.96 }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.7, ease: EASE_OUT_EXPO }
      }
      className="relative overflow-hidden rounded-2xl border px-8 py-12 text-center sm:px-16 sm:py-16"
      style={{
        borderColor: "rgb(34 197 94 / 0.3)",
        backgroundColor: "rgb(34 197 94 / 0.04)",
        boxShadow: "0 0 80px rgb(34 197 94 / 0.10) inset, 0 0 120px rgb(34 197 94 / 0.06)",
      }}
      aria-label="Build complete"
    >
      {/* Ambient glow radial */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgb(34 197 94 / 0.07) 0%, transparent 70%)",
        }}
      />

      {/* Checkmark */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { scale: 0, rotate: -20 }}
        animate={
          reducedMotion
            ? { opacity: isVisible ? 1 : 0 }
            : isVisible
              ? { scale: 1, rotate: 0 }
              : { scale: 0, rotate: -20 }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: EASE_OUT_QUART, delay: 0.15 }
        }
        className="mb-6 flex justify-center"
        aria-hidden="true"
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 sm:h-20 sm:w-20"
          style={{
            borderColor: "rgb(34 197 94 / 0.5)",
            backgroundColor: "rgb(34 197 94 / 0.10)",
            boxShadow: "0 0 32px rgb(34 197 94 / 0.3)",
          }}
        >
          <CheckCircle size={32} color="rgb(34 197 94)" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Headline */}
      <motion.p
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={
          reducedMotion
            ? { opacity: isVisible ? 1 : 0 }
            : isVisible
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 12 }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.25 }
        }
        className="mb-2 font-mono text-sm uppercase tracking-widest"
        style={{ color: "rgb(34 197 94 / 0.75)" }}
        aria-hidden="true"
      >
        Pipeline complete
      </motion.p>

      <motion.h2
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={
          reducedMotion
            ? { opacity: isVisible ? 1 : 0 }
            : isVisible
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 16 }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }
        }
        className="text-3xl font-bold sm:text-4xl lg:text-5xl"
        style={{ color: "rgb(250 250 250)" }}
      >
        ✓ Build Complete.
      </motion.h2>

      <motion.p
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={
          reducedMotion
            ? { opacity: isVisible ? 1 : 0 }
            : isVisible
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 12 }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.4 }
        }
        className="mx-auto mt-4 max-w-md text-sm text-text-secondary sm:text-base"
      >
        Every project ends with a handover that actually makes sense —
        and a team that stays accountable for what they shipped.
      </motion.p>
    </motion.div>
  );
}
