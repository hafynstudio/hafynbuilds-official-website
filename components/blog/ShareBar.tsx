"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { Link2, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// ShareBar -- floating share controls for individual article pages.
//
// Desktop: sticky vertical bar on the left side of the article, appears
// after the user scrolls past the article hero (300px threshold).
// Mobile: horizontal strip pinned to the bottom of the viewport, always
// visible (no scroll threshold -- on mobile, sharing is more likely to
// happen at any point in the read, not just after a scroll distance).
//
// Share targets (Decision D47): X, LinkedIn, Copy Link.
// Facebook/WhatsApp/Reddit excluded -- not content-amplification channels
// for this audience.
//
// Motion posture: CSS opacity/translate transitions only. No Framer Motion
// -- this component is mounted for the entire article page lifetime and
// should have near-zero ongoing cost. prefers-reduced-motion respected.
// ---------------------------------------------------------------------------

interface ShareBarProps {
  title: string;
  /** Canonical article URL -- passed from the server component so the
   *  client never has to reconstruct it from window.location (avoids
   *  hydration mismatches on SSR). */
  url: string;
}

// ---------------------------------------------------------------------------
// SVG icon components -- inline SVGs for X and LinkedIn because Lucide
// doesn't include branded social icons. Stroke-width matches ICON_STROKE_WIDTH
// for visual consistency with the rest of the icon system.
// ---------------------------------------------------------------------------

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* X (formerly Twitter) logo path -- official shape */}
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Share button -- shared between desktop and mobile layouts.
// ---------------------------------------------------------------------------

interface ShareButtonProps {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  /** Tint class applied on hover -- platform-specific accent color. */
  hoverTint: string;
  /** Whether this button is in the "copied" success state. */
  isCopied?: boolean;
}

function ShareButton({
  label,
  onClick,
  icon,
  hoverTint,
  isCopied = false,
}: ShareButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        // Base -- glass surface, consistent with the site's button system
        "group relative flex items-center justify-center",
        "rounded-lg border border-border-hairline bg-bg-elevated",
        "text-text-tertiary",
        // Size -- 40x40 on desktop (sidebar), 44x44 on mobile (bottom bar)
        "h-10 w-10 md:h-10 md:w-10",
        // Transition
        "transition-[border-color,color,background-color,box-shadow] duration-base ease-out-quart",
        // Hover
        "hover:border-white/10 hover:bg-bg-tertiary",
        hoverTint,
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
      )}
    >
      {isCopied ? (
        <Check
          size={15}
          strokeWidth={ICON_STROKE_WIDTH}
          className="text-accent-glow"
          aria-hidden="true"
        />
      ) : (
        icon
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ShareBar({ title, url }: ShareBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Desktop visibility: appears after scrolling 300px past page top.
  // The mobile strip is always visible (CSS handles this -- no JS needed
  // for mobile since it's always in the layout flow at the bottom).
  useEffect(() => {
    function onScroll() {
      setIsVisible(window.scrollY > 300);
    }
    // Set initial state on mount (handles refresh mid-article).
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---------------------------------------------------------------------------
  // Share action handlers
  // ---------------------------------------------------------------------------

  function shareToX() {
    const text = encodeURIComponent(`${title} — via @hafynbuilds`);
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareToLinkedIn() {
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function copyLink() {
    if (isCopied) return;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      // Reset the copied state after 2 seconds -- long enough to read
      // the confirmation, short enough to not feel broken.
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context, old browser).
      // Silent failure is acceptable here -- the user can still manually
      // copy from the address bar. We don't show an error toast because
      // there's no toast system on article pages.
    }
  }

  const buttons = [
    {
      label: "Share on X",
      onClick: shareToX,
      icon: <XIcon size={15} />,
      hoverTint: "hover:text-white",
    },
    {
      label: "Share on LinkedIn",
      onClick: shareToLinkedIn,
      icon: <LinkedInIcon size={15} />,
      hoverTint: "hover:text-[#0A66C2]",
    },
    {
      label: isCopied ? "Link copied!" : "Copy link",
      onClick: copyLink,
      icon: (
        <Link2
          size={15}
          strokeWidth={ICON_STROKE_WIDTH}
          aria-hidden="true"
        />
      ),
      hoverTint: "hover:text-accent-glow",
      isCopied,
    },
  ];

  return (
    <>
      {/* ----------------------------------------------------------------
          Desktop: vertical sticky sidebar -- left of article content.
          Hidden on mobile (md:flex).
          Appears/disappears via opacity + translate on scroll threshold.
      ---------------------------------------------------------------- */}
      <aside
        aria-label="Share this article"
        className={cn(
          // Position: fixed left, vertically centered in viewport.
          // Left value chosen so it clears the readable measure column
          // on wide viewports without overlapping content.
          "fixed left-6 top-1/2 z-30 -translate-y-1/2",
          "hidden md:flex flex-col gap-2",
          // Visibility transition -- opacity + slight x-translate.
          // prefers-reduced-motion collapses the transition.
          "transition-[opacity,transform] duration-300 ease-out-quart",
          "motion-reduce:transition-none",
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-3 pointer-events-none"
        )}
      >
        {/* Share label -- rotated, sits above the buttons */}
        <span
          className={cn(
            "mb-1 origin-center -rotate-90 self-center",
            "font-mono text-[9px] uppercase tracking-widest text-text-disabled",
            "whitespace-nowrap"
          )}
          aria-hidden="true"
        >
          Share
        </span>

        {buttons.map((btn) => (
          <ShareButton key={btn.label} {...btn} />
        ))}
      </aside>

      {/* ----------------------------------------------------------------
          Mobile: horizontal strip pinned to bottom of viewport.
          Visible only on mobile (md:hidden). Always visible -- no scroll
          threshold, sharing is likely at any point in the read on mobile.
      ---------------------------------------------------------------- */}
      <div
        aria-label="Share this article"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 md:hidden",
          // Glass surface with top border -- consistent with mobile sheet
          // pattern used elsewhere in the site.
          "border-t border-border-hairline bg-bg-deep/90 backdrop-blur-md",
          "px-4 py-3"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-disabled">
            Share this article
          </span>
          <div className="flex items-center gap-2">
            {buttons.map((btn) => (
              <ShareButton key={btn.label} {...btn} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}