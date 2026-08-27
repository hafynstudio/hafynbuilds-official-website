import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_MAP, ICON_STROKE_WIDTH } from "@/lib/icons";
import type { Industry, IndustryVisualTheme } from "@/types/industry";

const THEME_ICON_CLASS: Record<IndustryVisualTheme, string> = {
  warm: "text-badge-founding",
  clean: "text-accent-glow",
  professional: "text-accent",
  elegant: "text-theme-elegant",
  vibrant: "text-theme-vibrant",
};

const THEME_GLOW_CLASS: Record<IndustryVisualTheme, string> = {
  warm: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]",
  clean: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]",
  professional: "group-hover:shadow-[0_0_40px_rgba(62,123,250,0.12)]",
  elegant: "group-hover:shadow-[0_0_40px_rgba(244,165,178,0.12)]",
  vibrant: "group-hover:shadow-[0_0_40px_rgba(192,111,247,0.12)]",
};

const THEME_BORDER_CLASS: Record<IndustryVisualTheme, string> = {
  warm: "group-hover:border-badge-founding/25",
  clean: "group-hover:border-accent-glow/25",
  professional: "group-hover:border-accent/25",
  elegant: "group-hover:border-theme-elegant/25",
  vibrant: "group-hover:border-theme-vibrant/25",
};

const THEME_DOT_CLASS: Record<IndustryVisualTheme, string> = {
  warm: "bg-badge-founding",
  clean: "bg-accent-glow",
  professional: "bg-accent",
  elegant: "bg-theme-elegant",
  vibrant: "bg-theme-vibrant",
};

export function IndustryCard({ industry }: { industry: Industry }) {
  const IconComponent = ICON_MAP[industry.iconOrIllustration];

  return (
    <Link
      href={`/investment/${industry.id}`}
      aria-label={`View packages for ${industry.name}`}
      data-industry-slug={industry.id}
      data-industry-card={industry.id}
      data-industry-category={industry.category}
      data-industry-search-text={`${industry.name} ${industry.description} ${industry.category}`.toLowerCase()}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-4 rounded-card p-6",
        "border border-border-hairline bg-bg-elevated",
        "shadow-card-rest",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-card",
        "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent",
        "transition-[border-color,box-shadow,transform] duration-base ease-out-quart",
        "hover:-translate-y-1 hover:bg-bg-elevated-hover hover:shadow-card-hover",
        THEME_BORDER_CLASS[industry.visualTheme],
        THEME_GLOW_CLASS[industry.visualTheme],
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
      )}
    >
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
        <span
          aria-hidden="true"
          className={cn(
            "mt-1 h-1.5 w-1.5 rounded-full opacity-60",
            THEME_DOT_CLASS[industry.visualTheme]
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-sans text-sm font-semibold leading-snug text-text-primary">
          {industry.name}
        </h3>
        <p className="font-sans text-xs leading-relaxed text-text-secondary line-clamp-2">
          {industry.description}
        </p>
      </div>

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
    </Link>
  );
}
