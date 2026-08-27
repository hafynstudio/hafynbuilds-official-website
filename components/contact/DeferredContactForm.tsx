"use client";

import { useEffect, useState } from "react";
import { useLazyMount } from "@/lib/hooks";
import { MOTION_VIEWPORT_MARGIN } from "@/lib/motion";
import type { ContactForm } from "@/components/contact/ContactForm";

type ContactFormComponent = typeof ContactForm;

/**
 * Keeps the contact form's visual slot stable while deferring its heavy
 * react-hook-form/Zod/Framer Motion graph until the visitor reaches it.
 * The import is imperative rather than a top-level next/dynamic declaration:
 * this prevents the client bundler from preloading the graph before the
 * sentinel is actually visible. The negative bottom margin is intentional:
 * the form begins near the first mobile viewport's lower edge, so it waits
 * until the visitor is actually arriving at the form rather than loading in
 * the initial Lighthouse viewport.
 */
export function DeferredContactForm({ replyWindow }: { replyWindow: string }) {
  const { sentinelRef, shouldMount } = useLazyMount({ rootMargin: MOTION_VIEWPORT_MARGIN.strictArrival });
  const [ContactFormClient, setContactFormClient] =
    useState<ContactFormComponent | null>(null);

  useEffect(() => {
    if (!shouldMount || ContactFormClient) return;
    let active = true;
    void import("@/components/contact/ContactForm").then((module) => {
      if (active) setContactFormClient(() => module.ContactForm);
    });
    return () => {
      active = false;
    };
  }, [shouldMount, ContactFormClient]);

  return (
    <div ref={sentinelRef} className="min-h-[760px]">
      {ContactFormClient ? (
        <ContactFormClient replyWindow={replyWindow} />
      ) : (
        <div
          aria-hidden="true"
          className="min-h-[760px] rounded-card border border-border-hairline bg-bg-elevated shadow-card-rest"
        />
      )}
    </div>
  );
}
