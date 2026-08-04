import { cn } from "@/lib/utils";
import type { ResolvedPrice } from "@/lib/currency/engine";

interface PriceCalloutProps {
  resolved: ResolvedPrice;
  isHydrated: boolean;
  className?: string;
}

// Reusable price display component. Handles:
//   - Strike-through original price (small, muted gray)
//   - Active price (large, bright white, tabular-nums for digit alignment)
//   - Skeleton state while currency is hydrating from geo/localStorage
//
// The founding-badge line ("X of 8 spots remaining") is rendered by the
// parent card, not here — this component is purely price numbers.
// tabular-nums is critical: without it, digits like "1" and "8" have
// different widths and the three cards' prices misalign visibly.
export function PriceCallout({
  resolved,
  isHydrated,
  className,
}: PriceCalloutProps) {
  if (!isHydrated) {
    return (
      <div className={cn("space-y-2", className)} aria-busy="true">
        {/* Composited shimmer pattern (BUG-024):
            Parent = static gradient skeleton base, overflow-hidden clips child travel.
            Child = translateX-animated overlay — GPU-composited, zero paint cost.
            Replaces the old backgroundPosition approach which was non-composited. */}
        <div className="relative h-4 w-24 overflow-hidden rounded bg-surface">
          <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-surface-raised/60 to-transparent" />
        </div>
        <div className="relative h-10 w-36 overflow-hidden rounded bg-surface">
          <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-surface-raised/60 to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {resolved.strikeDisplay && (
        <p className="font-mono text-sm tabular-nums text-price-strike line-through">
          {resolved.strikeDisplay}
        </p>
      )}
      <p className="font-mono text-3xl font-bold tabular-nums leading-none text-price-active">
        {resolved.activeDisplay}
      </p>
    </div>
  );
}
