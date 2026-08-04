import Image from "next/image";
import { cn } from "@/lib/utils";

// Intrinsic PNG dimensions -- next/image requires these for layout
// reservation. Actual display size is driven entirely by the `heightPx`
// prop; width follows automatically via aspect-ratio-preserving CSS.
const INTRINSIC_W = 296;
const INTRINSIC_H = 112;
const DEFAULT_HEIGHT_PX = 72;

interface SignatureProps {
  /** Rendered display height in px. Width is derived automatically to
   * preserve the source PNG's aspect ratio -- never stretched. */
  heightPx?: number;
  className?: string;
}

/**
 * Renders /public/images/signature.png at a caller-specified height.
 * Promoted from a local function inside FounderTeaser.tsx (Phase 5) once
 * ClosingStatement.tsx (Phase 13) became a second real consumer needing
 * the identical treatment -- Decision D29, mirroring the same
 * promotion pattern already used for FRAMER_COLOR_TOKENS in lib/motion.ts.
 *
 * No background/border/shadow on the wrapper -- the PNG's transparent
 * background blends directly into whatever dark surface it sits on.
 * Opacity 0.88 keeps it slightly understated, consistent with real ink
 * on paper never reading as 100% opaque against a dark background.
 */
export function Signature({
  heightPx = DEFAULT_HEIGHT_PX,
  className,
}: SignatureProps) {
  return (
    <div
      className={cn("shrink-0", className)}
      style={{ maxWidth: "min(100%, 220px)" }}
    >
      <Image
        src="/images/signature.png"
        alt="Zain Marwat signature"
        width={INTRINSIC_W}
        height={INTRINSIC_H}
        style={{
          height: heightPx,
          width: "auto",
          opacity: 0.88,
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}
