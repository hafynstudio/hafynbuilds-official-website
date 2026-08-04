import { cn } from "@/lib/utils";

interface RecommendedStampProps {
  className?: string;
}

// Rotated amber "Most Chosen" stamp for the Growth (recommended) card.
// The -8deg rotation + subtle border give it a physical rubber-stamp
// aesthetic \u2014 deliberately not a perfectly-aligned pill badge, which
// would read as generic SaaS "Popular" chrome.
//
// aria-hidden: the "recommended" status is already conveyed to screen
// readers by the aria-label on the card element itself (see
// FoundationPackages.tsx), so this stamp is purely visual redundancy
// for sighted users \u2014 no need to announce it twice.
export function RecommendedStamp({ className }: RecommendedStampProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "inline-flex -rotate-[8deg] items-center gap-1.5 rounded-sm border border-warning/40 bg-warning/10 px-2.5 py-1",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-warning">
        Most Chosen
      </span>
    </div>
  );
}
