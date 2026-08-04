import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "card" | "circle" | "rect";

const VARIANT_STYLES: Record<SkeletonVariant, string> = {
  text: "h-4 rounded-sm",
  card: "h-64 rounded-lg",
  circle: "rounded-full aspect-square",
  rect: "rounded-md",
};

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

/**
 * Branded luxury loading placeholder — used everywhere content is
 * async-loaded (industry cards, package cards, pricing cards per PRD
 * 2.2.6). Deliberately never a generic spinner or blank screen. The
 * shimmer sweep uses an accent-tinted gradient (not default gray) so it
 * reads as an intentional brand moment rather than framework boilerplate.
 * Under prefers-reduced-motion, the global override in globals.css
 * collapses the animation duration to near-zero automatically — no
 * separate reduced-motion branch needed here.
 */
export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative overflow-hidden bg-surface",
        VARIANT_STYLES[variant],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    >
      {/* Composited shimmer pattern (BUG-024):
          Parent = static accent-tinted base, overflow-hidden clips child travel.
          Child = translateX-animated overlay — GPU-composited, zero paint cost.
          Preserves Skeleton's accent-tint identity. */}
      <div
        aria-hidden="true"
        className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
      />
    </div>
  );
}
