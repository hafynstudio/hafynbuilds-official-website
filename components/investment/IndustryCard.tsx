"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_MAP, ICON_STROKE_WIDTH } from "@/lib/icons";
import { EASE_OUT_QUART } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Industry, IndustryVisualTheme } from "@/types/industry";

// Visual theme → Tailwind class maps.
// ALL color references go through design-token-backed classes — no raw
// hex values. warm/clean/professional reuse existing tokens;
// elegant/vibrant use the 2 new tokens added to the system in Phase 11.
const THEME_ICON_CLASS: Record<IndustryVisualTheme, string> = {
  warm:         "text-badge-founding",
  clean:        "text-accent-glow",
  professional: "text-accent",
  elegant:      "text-theme-elegant",
  vibrant:      "text-theme-vibrant",
};

const THEME_GLOW_CLASS: Record<IndustryVisualTheme, string> = {
  warm:         "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]",
  clean:        "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]",
  professional: "group-hover:shadow-[0_0_40px_rgba(62,123,250,0.12)]",
  elegant:      "group-hover:shadow-[0_0_40px_rgba(244,165,178,0.12)]",
  vibrant:      "group-hover:shadow-[0_0_40px_rgba(192,111,247,0.12)]",
};

const THEME_BORDER_CLASS: Record<IndustryVisualTheme, string> = {
  warm:         "group-hover:border-badge-founding/25",
  clean:        "group-hover:border-accent-glow/25",
  professional: "group-hover:border-accent/25",
  elegant:      "group-hover:border-theme-elegant/25",
  vibrant:      "group-hover:border-theme-vibrant/25",
};

const THEME_DOT_CLASS: Record<IndustryVisualTheme, string> = {
  warm:         "bg-badge-founding",
  clean:        "bg-accent-glow",
  professional: "bg-accent",
  elegant:      "bg-theme-elegant",
  vibrant:      "bg-theme-vibrant",
};

interface IndustryCardProps {
  industry: Industry;
  /** Called when the card is activated (click or keyboard Enter/Space).
   * Phase 12 will wire this to open the IndustryModal. In Phase 11 the
   * handler is connected at the IndustryExplorer level and can be a
   * no-op — the card itself is fully interactive and accessible either
   * way. */
  onSelect: (industry: Industry) => void;
  /** Visual entrance delay for stagger effect — passed from the parent
   * grid, varies by card index. */
  entranceDelay?: number;
}

export function IndustryCard({
  industry,
  onSelect,
  entranceDelay = 0,
}: IndustryCardProps) {
  const IconComponent = ICON_MAP[industry.iconOrIllustration];
  const prefersReducedMotion = usePrefersReducedMotion();

  function handleActivate() {
    onSelect(industry);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.4, delay: entranceDelay, ease: EASE_OUT_QUART }
      }
      // layout — enables smooth positional reflow when the grid filters
      // (cards animate to new positions rather than jumping).
      layout
      layoutId={`industry-card-${industry.id}`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`View packages for ${industry.name}`}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className={cn(
          // Base glass-surface (consistent with site-wide Card pattern)
          "group relative flex cursor-pointer flex-col gap-4 rounded-card p-6",
          "border border-border-hairline bg-bg-elevated",
          "shadow-card-rest",
          // Top-edge highlight — same micro-detail as Card.tsx's ::before
          "before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-card",
          "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent",
          // Transitions
          "transition-[border-color,box-shadow,transform] duration-base ease-out-quart",
          "hover:-translate-y-1 hover:bg-bg-elevated-hover hover:shadow-card-hover",
          // Theme-specific border + glow on hover
          THEME_BORDER_CLASS[industry.visualTheme],
          THEME_GLOW_CLASS[industry.visualTheme],
          // Focus-visible ring (keyboard navigation)
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
        )}
      >
        {/* Icon row */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md",
              "border border-border-hairline bg-bg-primary/60"
            )}
          >
            {IconComponent ? (
              <IconComponent
                size={18}
                strokeWidth={ICON_STROKE_WIDTH}
                className={cn(
                  "transition-colors duration-base",
                  THEME_ICON_CLASS[industry.visualTheme]
                )}
                aria-hidden="true"
              />
            ) : null}
          </div>

          {/* Category dot — visual theme accent, top-right corner */}
          <span
            aria-hidden="true"
            className={cn(
              "mt-1 h-1.5 w-1.5 rounded-full opacity-60",
              THEME_DOT_CLASS[industry.visualTheme]
            )}
          />
        </div>

        {/* Name + description */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-sans text-sm font-semibold leading-snug text-text-primary">
            {industry.name}
          </h3>
          <p className="font-sans text-xs leading-relaxed text-text-secondary line-clamp-2">
            {industry.description}
          </p>
        </div>

        {/* Footer row: category label + arrow */}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
            {industry.category}
          </span>
          <ArrowRight
            size={14}
            strokeWidth={ICON_STROKE_WIDTH}
            aria-hidden="true"
            className={cn(
              "transition-[transform,color] duration-base ease-out-quart",
              "text-text-tertiary",
              "group-hover:translate-x-0.5",
              THEME_ICON_CLASS[industry.visualTheme].replace(
                "text-",
                "group-hover:text-"
              )
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}
