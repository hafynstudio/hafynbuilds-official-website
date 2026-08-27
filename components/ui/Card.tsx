import { cn } from "@/lib/utils";

type CardPadding = "none" | "sm" | "md" | "lg";

const PADDING_STYLES: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds hover lift + border/shadow response — use for clickable cards
   * (e.g. industry cards, package cards). Static content cards (e.g. a
   * quote block) should leave this off. */
  interactive?: boolean;
  padding?: CardPadding;
  /** Applies the Phase 1 grain-texture utility for cards that sit on
   * large flat surfaces where extra depth is wanted (per PRD 3.1 —
   * avoids the flat/cheap-black look). Off by default since most cards
   * will be small enough that grain isn't visually meaningful. */
  noise?: boolean;
  children: React.ReactNode;
}

export function Card({
  interactive = false,
  padding = "md",
  noise = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface shadow-glass-md",
        // Subtle top-edge highlight line — the detail that separates a
        // real "glass surface" from a flat bordered box.
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-lg before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-base ease-out-quart hover:-translate-y-1 active:-translate-y-0.5 hover:border-border-hover active:border-border-hover hover:shadow-glass-lg active:shadow-glass-lg motion-reduce:transform-none",
        noise && "bg-grain",
        PADDING_STYLES[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
