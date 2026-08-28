"use client";

import { useEffect, useState } from "react";
import type { ContactForm } from "@/components/contact/ContactForm";

type ContactFormComponent = typeof ContactForm;

/**
 * Loads the interactive form as soon as the Contact page mounts rather than
 * waiting for a scroll-triggered sentinel. The reserved slot keeps the page
 * geometry stable while the route-specific react-hook-form/Zod/Framer Motion
 * graph is fetched and hydrated.
 */
export function DeferredContactForm({ replyWindow }: { replyWindow: string }) {
  const [ContactFormClient, setContactFormClient] =
    useState<ContactFormComponent | null>(null);

  useEffect(() => {
    if (ContactFormClient) return;
    let active = true;
    void import("@/components/contact/ContactForm").then((module) => {
      if (active) setContactFormClient(() => module.ContactForm);
    });
    return () => {
      active = false;
    };
  }, [ContactFormClient]);

  return (
    <div className="min-h-[760px]">
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
