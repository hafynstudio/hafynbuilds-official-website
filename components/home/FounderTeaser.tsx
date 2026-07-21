"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RevealSection } from "@/components/ui/RevealSection";
import { founder } from "@/data/founder";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Home's Founder teaser strip (PRD §2.2.1) — parallax photo + quote,
 * linking to the full Founder page (Phase 13). Name and title are real,
 * locked content. The photo uses next/image when a real photoUrl is
 * available, or a styled gradient placeholder when photoUrl is null
 * (swap-in pattern: set founder.photoUrl = "/images/founder.jpg" in
 * data/founder.ts and this component upgrades automatically). The tagline
 * is flagged as a placeholder in the data layer — see data/founder.ts.
 *
 * Parallax: useScroll targets this section element with offset
 * ["start end", "end start"], mapping scroll progress to a ±8% y-shift
 * on the photo. This is a motion-value transform — never touches React
 * state, never re-renders on scroll. Disabled for prefers-reduced-motion.
 */
export function FounderTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // ±8% vertical travel on the photo as the section scrolls through the
  // viewport — subtle enough to read as depth, not distraction.
  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-8%", "8%"]
  );

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-t border-border bg-bg-secondary px-6 py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row">

        {/* Photo column */}
        <RevealSection className="relative aspect-square w-full max-w-sm shrink-0 overflow-hidden rounded-xl border border-border">
          <motion.div
            aria-hidden="true"
            style={{ y: photoY }}
            className="absolute inset-[-8%]"
          >
            {founder.photoUrl ? (
              <Image
                src={founder.photoUrl}
                alt={`${founder.name}, ${founder.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 384px"
              />
            ) : (
              // Gradient placeholder — same swap-in pattern as Logo.tsx.
              // Replace by setting founder.photoUrl in data/founder.ts.
              <div className="h-full w-full bg-gradient-to-br from-accent/30 via-surface to-accent-glow/20" />
            )}
          </motion.div>
          {!founder.photoUrl && (
            <span className="absolute inset-0 flex items-end justify-center pb-4 font-mono text-xs text-text-tertiary">
              Photo coming soon
            </span>
          )}
        </RevealSection>

        {/* Quote + name column */}
        <RevealSection className="max-w-xl text-center lg:text-left">
          <p className="mb-3 font-mono text-sm text-accent">From the Founder</p>
          <blockquote className="text-2xl font-semibold leading-snug text-text-primary sm:text-3xl">
            &ldquo;{founder.tagline}&rdquo;
          </blockquote>
          <p className="mt-6 text-text-secondary">
            {founder.name}&nbsp;&mdash;&nbsp;{founder.title}
          </p>
          <Link
            href="/founder"
            className="mt-6 inline-flex items-center gap-2 font-medium text-accent transition-colors duration-base hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
          >
            Meet the Founder
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </RevealSection>

      </div>
    </section>
  );
}
