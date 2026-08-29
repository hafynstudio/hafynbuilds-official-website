"use client";

import { motion } from "framer-motion";
import { socialLinks } from "@/data/social-links";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface WhatsAppCTAProps {
  subtext?: string;
  prefillMessage?: string;
  variant?: "hero" | "card";
}

/**
 * Signature WhatsApp CTA with dual-layer pulse animation.
 *
 * OVERFLOW FIX (audit item 1 + 2, root cause): the pulse rings animate
 * `scale: 1.6` on an absolutely-positioned `h-full w-full` element. A
 * transform-scaled element's bounding box IS included in an ancestor's
 * scrollWidth calculation even when nothing is meant to render outside
 * its visual container -- this was the actual root cause of the page-wide
 * horizontal scrollbar and the resulting text truncation on this card's
 * subtext (the card was being pushed/measured past the viewport edge).
 *
 * Fix: the outer wrapper now has `overflow-hidden` matching the card's
 * own border-radius, so the ring visually pulses and fades but is
 * clipped to the card's rounded-rect bounds instead of contributing to
 * page scrollWidth. Trade-off: the ring no longer visibly grows past the
 * card edge (it fades out at the boundary instead) -- an acceptable and
 * barely perceptible change for a CTA this size, and it also means the
 * icon's box-shadow glow may be marginally compressed on the side with
 * the least padding (hero variant, left edge) -- both trade-offs are
 * intentional and documented here rather than silently accepted.
 */
export function WhatsAppCTA({
  subtext = "For fastest response and direct founder access.",
  prefillMessage,
  variant = "card",
}: WhatsAppCTAProps) {
  const whatsapp = socialLinks.find((l) => l.platform === "whatsapp");
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!whatsapp) return null;

  const href = prefillMessage
    ? `${whatsapp.url}?text=${encodeURIComponent(prefillMessage)}`
    : whatsapp.url;

  const isHero = variant === "hero";

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut",
              }}
              className="absolute h-full w-full rounded-2xl border border-whatsapp/40"
            />
          ))}
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("contact_whatsapp_click", { placement: variant })}
        className={cn(
          "group relative flex w-full items-center gap-4 rounded-2xl transition-all",
          "border border-whatsapp/25 bg-whatsapp/[0.06]",
          "hover:border-whatsapp/40 hover:bg-whatsapp/10",
          "active:scale-[0.99]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
          "duration-base",
          isHero && "min-h-[88px] p-5",
          !isHero && "flex-col justify-center p-8 text-center"
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-whatsapp text-white",
            "shadow-[0_0_24px_rgba(37,211,102,0.45)]",
            "transition-transform duration-slow group-hover:scale-110",
            isHero ? "h-14 w-14" : "mb-4 h-14 w-14"
          )}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </div>

        {/* min-w-0 is required on a flex child for text-wrapping (rather
            than overflow) to work at all -- without it, flex items default
            to a min-width equal to their content's natural width, which
            silently defeats break-words. */}
        <div className={cn("min-w-0", isHero ? "flex-1 text-left" : "text-center")}>
          <p
            className={cn(
              "font-semibold text-text-primary",
              isHero ? "text-lg" : "mb-1 text-xl"
            )}
          >
            Start via WhatsApp
          </p>
          {/* FIX (audit item 2): break-words as defense-in-depth. The
              truncation seen in QA was primarily a symptom of the
              page-level overflow bug (text was being physically cut off
              at the viewport edge, not ellipsis-truncated) -- but this
              guards against long words ever forcing the card wider than
              its flex container regardless of parent overflow state. */}
          <p className={cn("break-words text-text-secondary", isHero ? "text-sm" : "text-base")}>
            {subtext}
          </p>
        </div>

        {isHero && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5 shrink-0 text-whatsapp transition-transform duration-base group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        )}
      </a>
    </div>
  );
}