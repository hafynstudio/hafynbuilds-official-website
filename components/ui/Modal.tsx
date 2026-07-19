"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap, useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { SPRING_SMOOTH } from "@/lib/motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Required for accessibility — rendered as a visually-hidden h2 tied
   * to aria-labelledby, even if the modal's own content includes a
   * differently-styled visible heading. */
  title: string;
  children: React.ReactNode;
  className?: string;
  hideDefaultCloseButton?: boolean;
}

/**
 * Desktop → fullscreen immersive overlay. Mobile → fullscreen bottom
 * sheet with drag-to-dismiss. This exact component is what Investment's
 * Industry Explorer (Phase 12) reuses directly per PRD 2.2.6 Stage 4 —
 * the desktop/mobile dual behavior is a hard requirement, not a nicety.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  hideDefaultCloseButton = false,
}: ModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useFocusTrap(panelRef, isOpen);

  // Portals must only render client-side (no document in SSR).
  useEffect(() => setMounted(true), []);

  // Lock body scroll while open; restore the exact previous value on
  // close rather than assuming "visible", in case another overlay is
  // already stacked (defensive, cheap to get right).
  useEffect(() => {
    if (!isOpen) return;
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = original;
    };
  }, [isOpen]);

  // Capture/restore focus so keyboard and screen-reader users return
  // exactly where they were before opening the modal.
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;
      const frame = requestAnimationFrame(() => panelRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    if (previouslyFocusedElement.current instanceof HTMLElement) {
      previouslyFocusedElement.current.focus();
    }
  }, [isOpen]);

  // Escape-to-close only here — Tab-trapping now lives in useFocusTrap.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 500) onClose();
  }

  const panelTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, ...SPRING_SMOOTH };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal">
          <motion.div
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            drag={!isDesktop && !prefersReducedMotion ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            initial={
              isDesktop
                ? { opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }
                : { y: "100%" }
            }
            animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
            exit={
              isDesktop
                ? { opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }
                : { y: "100%" }
            }
            transition={panelTransition}
            className={cn(
              "absolute overflow-y-auto bg-bg-secondary outline-none",
              isDesktop
                ? "inset-0"
                : "inset-x-0 bottom-0 max-h-[92vh] rounded-t-xl border-t border-border",
              className
            )}
          >
            <h2 id="modal-title" className="sr-only">
              {title}
            </h2>

            {!isDesktop && (
              <div
                aria-hidden="true"
                className="sticky top-0 z-10 flex justify-center bg-bg-secondary pt-3 pb-1"
              >
                <span className="h-1 w-10 rounded-full bg-border-hover" />
              </div>
            )}

            {!hideDefaultCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={cn(
                  "absolute right-4 z-10 rounded-full p-2 text-text-secondary transition-colors duration-fast hover:bg-surface hover:text-text-primary",
                  isDesktop ? "top-4" : "top-10"
                )}
              >
                <X size={20} />
              </button>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
