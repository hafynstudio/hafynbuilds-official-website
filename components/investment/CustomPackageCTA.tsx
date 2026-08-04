"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealSection } from "@/components/ui/RevealSection";
import { ICON_STROKE_WIDTH } from "@/lib/icons";

export function CustomPackageCTA() {
  return (
    <RevealSection className="px-4 py-24 sm:px-6 lg:px-8">
      <section className="group relative mx-auto max-w-6xl overflow-hidden rounded-card border border-border-hairline bg-bg-elevated/60 p-8 sm:p-12 lg:p-16">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/6 blur-[120px] transition-all duration-700 group-hover:bg-accent/10"
        />

        <div className="relative z-10 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              Custom Scope
            </p>

            <h2 className="max-w-2xl font-sans text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              Didn&apos;t find the perfect package?
            </h2>

            <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-text-secondary">
              Some businesses need more than a fixed package — internal dashboards,
              AI workflows, multi-role platforms, automation layers, or deeply
              custom operational systems. That&apos;s where HAFYN BUILDS does its
              best work.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-4 self-stretch sm:self-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-text-primary bg-text-primary px-7 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bg-deep transition-[background-color,border-color,color,transform] duration-base ease-out-quart hover:border-accent hover:bg-accent hover:text-white"
            >
              Start a Custom Build
              <ArrowRight size={14} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
            </Link>

            <p className="font-sans text-xs leading-relaxed text-text-tertiary">
              Web apps · software · AI systems · enterprise solutions
            </p>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
