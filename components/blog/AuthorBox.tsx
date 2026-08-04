"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { founder } from "@/data/founder";

// ---------------------------------------------------------------------------
// AuthorBox -- appears at the bottom of every article page.
//
// Two responsibilities:
// 1. Visual: humanizes the article by connecting it to the founder's
//    identity -- photo, name, title, short bio excerpt, link to /founder.
// 2. SEO: this component is the visible counterpart to the Article schema's
//    author field. Together they reinforce the Article -> Person chain that
//    compounds the "who is Zain Marwat" attribution over time (PRD Section 4).
//    The link to /founder is the visible signal; the JSON-LD author field
//    in articleSchema() is the machine-readable signal. Both matter.
//
// Data source: data/founder.ts -- single source of truth. When the founder's
// photo, name, or title changes, it changes everywhere automatically.
//
// Motion posture: no animation. AuthorBox sits at the bottom of a long
// content page -- the user has been reading for minutes. A reveal animation
// here would feel like an interruption, not a delight. Static render only.
// ---------------------------------------------------------------------------

const MAX_BIO_LENGTH = 160;

function truncateBio(text: string): string {
  if (text.length <= MAX_BIO_LENGTH) return text;
  const truncated = text.slice(0, MAX_BIO_LENGTH).replace(/\s+\S*$/, "");
  return `${truncated}...`;
}

// Derives initials from a full name for the graceful photo fallback.
// Only used when founder.photoUrl is null (safety fallback -- production
// always has a real photo, but the type allows null so we handle it).
function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

interface AuthorBoxProps {
  className?: string;
}

export function AuthorBox({ className }: AuthorBoxProps) {
  const bio = truncateBio(founder.openingStatement);
  const initials = getInitials(founder.name);

  return (
    <aside
      aria-label="About the author"
      className={cn(
        "relative overflow-hidden rounded-card",
        "border border-border-hairline bg-bg-elevated",
        "shadow-card-rest",
        "before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px",
        "before:rounded-t-card",
        "before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent",
        "p-6 md:p-8",
        className
      )}
    >
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-disabled">
        Written by
      </p>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Portrait -- renders Image when photoUrl exists, initials
            fallback when it doesn't. Guards the TS narrowing cleanly. */}
        <Link
          href="/founder"
          className={cn(
            "relative shrink-0 overflow-hidden rounded-full",
            "h-16 w-16 md:h-20 md:w-20",
            "ring-1 ring-border-hairline",
            "transition-[box-shadow] duration-base ease-out-quart",
            "hover:ring-accent/40 hover:shadow-[0_0_20px_rgba(62,123,250,0.15)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
          )}
          aria-label={`Read more about ${founder.name}`}
          tabIndex={-1}
        >
          {founder.photoUrl ? (
            <Image
              src={founder.photoUrl}
              alt={`${founder.name} â€” ${founder.title}`}
              fill
              sizes="80px"
              className="object-cover object-top"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center bg-surface text-text-secondary font-mono text-sm font-semibold"
            >
              {initials}
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-3">
          <div>
            <Link
              href="/founder"
              className={cn(
                "font-sans text-lg font-semibold text-text-primary",
                "transition-colors duration-fast hover:text-accent",
                "focus-visible:outline-none focus-visible:underline"
              )}
            >
              {founder.name}
            </Link>
            <p className="mt-0.5 font-mono text-xs text-text-tertiary">
              {founder.title}
            </p>
          </div>

          <p className="font-sans text-sm leading-relaxed text-text-secondary">
            {bio}
          </p>

          <Link
            href="/founder"
            className={cn(
              "group mt-1 inline-flex w-fit items-center gap-1.5",
              "font-mono text-xs text-accent",
              "transition-[color,gap] duration-base ease-out-quart",
              "hover:text-accent-glow hover:gap-2",
              "focus-visible:outline-none focus-visible:underline"
            )}
          >
            Meet the Founder
            <ArrowRight
              size={12}
              strokeWidth={ICON_STROKE_WIDTH}
              aria-hidden="true"
              className="transition-transform duration-base ease-out-quart group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </aside>
  );
}