import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Loading screen renders a larger, standalone mark that isn't
   * navigable during the intro animation. */
  asLink?: boolean;
}

// TEMPORARY typographic wordmark — replace with the real HAFYN logo file
// (public/images/logo.png, pending from user per PRD §5) by swapping this
// component's internals for a next/image render. Every consumer (Header,
// Footer, MobileNav, LoadingScreen) imports THIS component rather than
// referencing an image path directly, so that swap requires editing only
// this one file, not every place the logo appears.
function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-text-primary">
        H
      </span>
      <span className="text-lg font-bold tracking-tight text-text-primary">
        HAFYN <span className="font-normal text-text-secondary">BUILDS</span>
      </span>
    </span>
  );
}

export function Logo({ className, asLink = true }: LogoProps) {
  if (!asLink) return <Mark className={className} />;

  return (
    <Link href="/" aria-label="HAFYN BUILDS — Home" className="shrink-0">
      <Mark className={className} />
    </Link>
  );
}
