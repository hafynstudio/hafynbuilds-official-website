import { cn } from "@/lib/utils";

interface CornerBracketsProps {
  className?: string;
  /** Tailwind color class for the bracket lines, e.g. "border-warning/50" */
  colorClass?: string;
  /** Length of each bracket arm in pixels */
  size?: number;
}

// Technical-drawing corner bracket marks (\u231C \u231D \u231E \u231F style)
// for framing featured cards. Four L-shapes rendered as CSS border pairs
// on absolute-positioned corner elements. Pure presentational \u2014 the
// featured/most-chosen state is already conveyed to screen readers via
// aria-labels on the surrounding card, so these are aria-hidden.
export function CornerBrackets({
  className,
  colorClass = "border-warning/50",
  size = 16,
}: CornerBracketsProps) {
  const arm = `${size}px`;

  const corners = [
    { pos: "top-0 left-0", borders: "border-t border-l" },
    { pos: "top-0 right-0", borders: "border-t border-r" },
    { pos: "bottom-0 left-0", borders: "border-b border-l" },
    { pos: "bottom-0 right-0", borders: "border-b border-r" },
  ] as const;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {corners.map(({ pos, borders }) => (
        <span
          key={pos}
          className={cn("absolute", pos, borders, colorClass)}
          style={{ width: arm, height: arm }}
        />
      ))}
    </div>
  );
}
