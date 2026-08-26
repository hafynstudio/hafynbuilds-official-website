"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsClient, usePrefersReducedMotion } from "@/lib/hooks";

const SESSION_KEY = "hafyn-loading-shown";
// Arbitrary but deliberate massing — a simple wireframe skyline
// silhouette, not a literal building illustration.
const BAR_HEIGHTS = [28, 44, 34, 56, 24, 40];

type SkylineStage = "hidden" | "risen" | "collapsed";

const skylineVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  risen: { scaleY: 1, opacity: 1 },
  collapsed: { scaleY: 0, opacity: 0 },
};

/**
 * First-visit-only, session-gated branded loading sequence (PRD §2.2.1):
 * the HAFYN wordmark draws in, briefly becomes a wireframe skyline (the
 * construction motif paid off fully on the Method page later), collapses
 * back, then dissolves to reveal the site. Mounted once in the root
 * layout — because the App Router root layout persists across
 * client-side navigations, this naturally only mounts once per real page
 * load; sessionStorage additionally prevents it replaying on a hard
 * refresh within the same browser tab.
 */
export function LoadingScreen() {
  const isClient = useIsClient();
  const [isDismissed, setIsDismissed] = useState(false);
  const [skylineStage, setSkylineStage] = useState<SkylineStage>("hidden");
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldShow = useMemo(() => {
    if (!isClient) return false;
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  }, [isClient]);
  const isVisible = shouldShow && !isDismissed;

  useEffect(() => {
    if (!isClient || !shouldShow) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // Storage can be blocked in privacy-restricted browsing modes.
    }
  }, [isClient, shouldShow]);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;

    // Explicit sequential stage timeline via a plain state machine —
    // deliberately NOT expressed as a single Framer Motion `animate`
    // array applying "risen" and "collapsed" together, which would
    // produce an ambiguous merged target (Framer resolves conflicting
    // values from whichever variant is last-applied, skipping the risen
    // state entirely). One variant name active at a time is predictable
    // and correct.
    const riseTimer = setTimeout(() => setSkylineStage("risen"), 180);
    const collapseTimer = setTimeout(() => setSkylineStage("collapsed"), 600);
    const dismissTimer = setTimeout(() => setIsDismissed(true), 900);

    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    function skip() {
      setIsDismissed(true);
    }
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);

    return () => {
      clearTimeout(riseTimer);
      clearTimeout(collapseTimer);
      clearTimeout(dismissTimer);
      document.documentElement.style.overflow = originalOverflow;
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [isVisible, prefersReducedMotion]);

  // Reduced-motion users still get a brief, deliberate brand moment
  // rather than the full sequence — never a jarring instant skip, but
  // also never the full ~2.6s animated timeline.
  useEffect(() => {
    if (!isVisible || !prefersReducedMotion) return;
    const timer = setTimeout(() => setIsDismissed(true), 250);
    return () => clearTimeout(timer);
  }, [isVisible, prefersReducedMotion]);

  // Nothing renders until the SSR-safe client snapshot is available. The
  // session flag itself is memoized for this mount so subsequent animation
  // state changes cannot hide the splash early.

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-loading-screen flex items-center justify-center bg-bg-primary"
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="HAFYN BUILDS is loading"
        >
          {prefersReducedMotion ? (
            <span className="text-2xl font-bold text-text-primary">
              HAFYN <span className="text-text-secondary">BUILDS</span>
            </span>
          ) : (
            <div className="flex flex-col items-center gap-8">
              <motion.div
                className="flex text-4xl font-bold tracking-tight text-text-primary"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {"HAFYN".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>

              <div className="flex items-end gap-2" aria-hidden="true">
                {BAR_HEIGHTS.map((height, i) => (
                  <motion.span
                    key={i}
                    className="w-3 origin-bottom rounded-sm border border-accent"
                    style={{ height }}
                    animate={skylineStage}
                    variants={skylineVariants}
                    transition={{
                      duration: 0.4,
                      ease: [0.76, 0, 0.24, 1],
                      delay: i * 0.06,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
