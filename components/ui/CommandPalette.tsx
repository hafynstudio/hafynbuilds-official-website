"use client";

import { useRef, useId } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ICON_STROKE_WIDTH } from "@/lib/icons";
import { EASE_OUT_QUART } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

// Inline command-palette-style search primitive.
// Visual language: search icon, focus-glow border, live result count,
// monospace accent on count — command-palette *feel* without the
// keyboard-triggered overlay (confirmed inline for Investment/Blog).
// Generic interface: items/onFilter pattern means Blog (Phase 14) reuses
// this identically. This component owns ONLY the input UI — result
// rendering is the consumer's responsibility.

interface CommandPaletteProps {
  /** Placeholder shown inside the input when empty. */
  placeholder?: string;
  /** Current search value — controlled by the parent. */
  value: string;
  /** Called on every keystroke with the new raw value.
   * Parent is responsible for debouncing if needed. */
  onChange: (value: string) => void;
  /** Total number of results currently showing. Displayed as a
   * monospace count badge when a query is active. `undefined` hides
   * the badge entirely (use when a count isn't meaningful). */
  resultCount?: number;
  className?: string;
  /** Accessible label for the input — defaults to placeholder text.
   * Override when the placeholder alone isn't descriptive enough for
   * screen-reader context. */
  ariaLabel?: string;
  /** ID of the results region this input controls. When provided,
   * applies `aria-controls` to the input, improving screen-reader UX
   * by explicitly connecting the search input to its results region. */
  resultsId?: string;
}

export function CommandPalette({
  placeholder = "Search...",
  value,
  onChange,
  resultCount,
  className,
  ariaLabel,
  resultsId,
}: CommandPaletteProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const hasQuery = value.trim().length > 0;
  const showCount = hasQuery && resultCount !== undefined;

  function handleClear() {
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div
      className={cn("relative w-full", className)}
      role="search"
    >
      {/* Search icon — left side, always visible */}
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
        size={16}
        strokeWidth={ICON_STROKE_WIDTH}
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        id={inputId}
        type="search"
        role="searchbox"
        aria-label={ariaLabel ?? placeholder}
        aria-controls={resultsId}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          // Layout
          "w-full rounded-md py-3 pl-10 pr-12 font-sans text-sm",
          // Colors
          "bg-bg-elevated text-text-primary placeholder:text-text-tertiary",
          // Border — default + focus-glow (the command-palette identity detail)
          "border border-border-hairline-strong",
          "outline-none ring-0",
          "transition-[border-color,box-shadow] duration-base ease-out-quart",
          "focus:border-accent/40 focus:shadow-[0_0_0_3px_rgba(62,123,250,0.12),0_0_24px_rgba(62,123,250,0.08)]",
          // Remove browser's default search-input clear button —
          // we render our own clear action with correct accessible label
          "[&::-webkit-search-cancel-button]:hidden",
          "[&::-webkit-search-decoration]:hidden"
        )}
      />

      {/* Right-side controls: result count badge + clear button */}
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {/* Result count — monospace, appears only when query is active */}
        <AnimatePresence mode="popLayout">
          {showCount && (
            <motion.span
              key="count"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.15, ease: EASE_OUT_QUART }
              }
              className="font-mono text-xs tabular-nums text-text-tertiary"
              aria-live="polite"
              aria-atomic="true"
            >
              {resultCount}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Clear button — appears only when query is active */}
        <AnimatePresence mode="popLayout">
          {hasQuery && (
            <motion.button
              key="clear"
              type="button"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.15, ease: EASE_OUT_QUART }
              }
              onClick={handleClear}
              aria-label="Clear search"
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full",
                "bg-surface text-text-tertiary",
                "transition-colors duration-fast",
                "hover:bg-surface-raised hover:text-text-primary",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-accent focus-visible:ring-offset-1",
                "focus-visible:ring-offset-bg-elevated"
              )}
            >
              <X size={10} strokeWidth={2.5} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
