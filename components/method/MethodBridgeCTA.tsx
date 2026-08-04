"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Closing bridge CTA → Investment page. PRD §2.2.5 requirement.
 * Reuses the established Button component (magnetic + border-sweep).
 */
export function MethodBridgeCTA() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:px-12"
      aria-labelledby="method-cta-heading"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          height: 300,
          background: "radial-gradient(ellipse 70% 100% at 50% 50%, rgb(62 123 250 / 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative">
        <motion.p
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: EASE_OUT_EXPO }
          }
          className="mb-3 font-mono text-xs uppercase tracking-widest"
          style={{ color: "rgb(62 123 250 / 0.75)" }}
          aria-hidden="true"
        >
          Ready to build?
        </motion.p>

        <motion.h2
          id="method-cta-heading"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.07 }
          }
          className="mb-5 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl"
        >
          See what we can build<br className="hidden sm:block" /> for your business.
        </motion.h2>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.14 }
          }
          className="mx-auto mb-10 max-w-md text-sm text-text-secondary sm:text-base"
        >
          Explore packages built for your industry — or tell us exactly
          what you need and we will scope it from scratch.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.21 }
          }
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href="/investment" variant="primary" size="lg" magnetic>
            View Investment
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Start a Conversation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
