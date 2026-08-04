"use client";

import { useEffect } from "react";

/**
 * CopyEmailHandler — mounts once on the Contact page and handles all
 * copy-email button clicks via event delegation. This lets DirectEmail
 * remain a server component (no "use client" needed there) while still
 * having a real interactive copy-to-clipboard handler.
 *
 * Pattern: data-copy-email attribute on the button carries the value to
 * copy. The handler reads it, writes to clipboard, then briefly shows
 * the #copy-confirm aria-live span.
 */
export function CopyEmailHandler() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-copy-email]");
      if (!btn) return;

      const email = btn.dataset.copyEmail;
      if (!email) return;

      navigator.clipboard?.writeText(email).then(() => {
        const confirm = document.getElementById("copy-confirm");
        if (!confirm) return;
        confirm.style.opacity = "1";
        setTimeout(() => {
          confirm.style.opacity = "0";
        }, 2000);
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Renders nothing — pure side-effect component
  return null;
}