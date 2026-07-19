"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { MAGNETIC_MAX_PULL_PX, SPRING_SNAPPY } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Enables the cursor-proximity magnetic pull. Defaults to on for
   * primary CTAs (per PRD 3.2) and off for ghost buttons, where the
   * effect would read as visual noise on lower-emphasis actions. */
  magnetic?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
  /** Providing `href` renders the button as a Next.js Link (for
   * navigation CTAs) instead of a <button> (for actions/form submits). */
  href?: string;
}

// The interactive element (<button> or <Link>) is ALWAYS a plain native
// element, never a Framer Motion component — the magnetic pull is applied
// to an outer motion.span wrapper instead (see render below). This means
// native attribute types (which include onAnimationStart, onDrag, etc.)
// never need to satisfy Framer Motion's incompatible redefinitions of
// those same event names, so no exclusion/cast gymnastics are needed here.
type ButtonProps = ButtonOwnProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement> &
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonOwnProps
  >;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-text-primary hover:bg-accent-hover hover:shadow-glow-accent",
  secondary:
    "bg-surface border border-border text-text-primary hover:border-border-hover hover:bg-surface-raised",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface/50",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-2",
  md: "h-11 px-6 text-base gap-2",
  lg: "h-14 px-8 text-lg gap-3",
};

/** Three-dot loading indicator — deliberately not a generic spinner ring,
 * to stay consistent with the brand's rejection of default/templated UI
 * chrome even in micro-states. Respects reduced-motion via the global
 * animation-duration override in globals.css. */
function LoadingDots() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  magnetic = variant === "primary",
  fullWidth = false,
  isLoading = false,
  className,
  children,
  href,
  disabled,
  ...props
}: ButtonProps) {
  const elementRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const magneticActive = magnetic && hasFinePointer && !prefersReducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_SNAPPY);
  const springY = useSpring(y, SPRING_SNAPPY);

  function handleMouseMove(e: React.MouseEvent) {
    if (!magneticActive || !elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / (rect.width / 2)) * MAGNETIC_MAX_PULL_PX);
    y.set((relY / (rect.height / 2)) * MAGNETIC_MAX_PULL_PX);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const isInteractive = variant !== "ghost";

  const sharedClassName = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-md font-medium",
    "transition-colors duration-base ease-out-quart",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {isLoading ? <LoadingDots /> : children}
      {/* Border light-sweep — pure CSS, no JS cost. Only meaningful on
          non-ghost variants, which have a visible fill/border to sweep
          across. */}
      {isInteractive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-[transform,opacity] duration-slow ease-out-expo group-hover:translate-x-[350%] group-hover:opacity-100" />
        </span>
      )}
    </>
  );

  const sharedMouseHandlers = magneticActive
    ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
    : {};

  const interactiveElement = href ? (
    <Link
      ref={elementRef}
      href={href}
      className={sharedClassName}
      aria-disabled={disabled}
      {...sharedMouseHandlers}
      {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
    >
      {content}
    </Link>
  ) : (
    <button
      ref={elementRef}
      type="button"
      className={sharedClassName}
      disabled={disabled || isLoading}
      {...sharedMouseHandlers}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );

  if (!magneticActive) {
    return interactiveElement;
  }

  return (
    <motion.span
      style={{ x: springX, y: springY }}
      className={cn("inline-block", fullWidth && "w-full")}
    >
      {interactiveElement}
    </motion.span>
  );
}
