import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Real HAFYN BUILDS brand lockup: the H mark is the transparent PNG
// (public/images/logo.png) and the HAFYN BUILDS wordmark is real HTML text.
// The PNG is the H mark ONLY — it does not contain the wordmark.
//
// Artwork geometry — measured deterministically with a local sharp alpha
// analysis, NOT assumed: the asset is a 1024×1024 transparent canvas, but the
// actual H-mark artwork occupies only x[315,707] y[149,641] (393×493 px). It
// is roughly centered horizontally but sits well above the canvas center,
// with heavy transparent padding on every side (315/316 px left/right,
// 149/382 px top/bottom). The fractions below are artwork/canvas ratios.
//
// That padding is why a naive "size the square image like an icon" treatment
// was visually wrong: rendered 1:1 at 28–32px, the visible H came out ~14px
// and drifted off-center. Instead we render the square asset large
// (--hmark-img, responsive) inside an overflow-hidden wrapper sized exactly
// to the artwork, then shift the asset with a translate so the H mark fills
// the wrapper. The visible result is the H at its true proportion
// (~25.5×32 px desktop, ~23×29 px mobile), vertically centered next to the
// wordmark — no microscopic mark, no transparent halo around it.
const ART = {
  left: 0.3076, // 315/1024 — artwork left edge as a fraction of canvas width
  top: 0.1455, // 149/1024 — artwork top edge as a fraction of canvas height
  width: 0.3838, // 393/1024 — artwork width as a fraction of canvas width
  height: 0.4814, // 493/1024 — artwork height as a fraction of canvas height
} as const;

// Rendered square asset size. The artwork is ~48% of its height, so these
// produce a visible H mark of ~32px (desktop) / ~29px (mobile).
const IMG_SIZE_VAR = "--hmark-img";

interface LogoProps {
  className?: string;
  /** Loading screen renders a larger, standalone mark that isn't
   * navigable during the intro animation. */
  asLink?: boolean;
}

function Mark() {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden",
        "[--hmark-img:60px]",
        "md:[--hmark-img:66.5px]"
      )}
      style={{
        width: `calc(var(${IMG_SIZE_VAR}) * ${ART.width})`,
        height: `calc(var(${IMG_SIZE_VAR}) * ${ART.height})`,
      }}
    >
      <Image
        src="/images/logo.png"
        alt=""
        width={1024}
        height={1024}
        preload
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `var(${IMG_SIZE_VAR})`,
          height: `var(${IMG_SIZE_VAR})`,
          maxWidth: "none",
          transform: `translate(calc(var(${IMG_SIZE_VAR}) * -${ART.left}), calc(var(${IMG_SIZE_VAR}) * -${ART.top}))`,
        }}
      />
    </span>
  );
}

export function Logo({ className, asLink = true }: LogoProps) {
  const lockup = (
    <span className={cn("flex items-center gap-2", className)}>
      <Mark />
      <span className="text-base font-semibold tracking-tight text-text-primary md:text-lg">
        HAFYN BUILDS
      </span>
    </span>
  );

  if (!asLink) return lockup;

  return (
    <Link
      href="/"
      aria-label="HAFYN BUILDS — Home"
      className="shrink-0"
    >
      {lockup}
    </Link>
  );
}
