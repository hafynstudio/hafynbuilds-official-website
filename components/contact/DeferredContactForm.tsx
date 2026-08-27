"use client";

import dynamic from "next/dynamic";
import { useLazyMount } from "@/lib/hooks";

const ContactFormClient = dynamic(
  () =>
    import("@/components/contact/ContactForm").then((m) => ({
      default: m.ContactForm,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

/**
 * Keeps the contact form's visual slot stable while deferring its heavy
 * react-hook-form/Zod/Framer Motion graph until the visitor reaches it.
 * The zero-margin sentinel means this is an interaction-adjacent boundary,
 * not an eager page-load import.
 */
export function DeferredContactForm({ replyWindow }: { replyWindow: string }) {
  const { sentinelRef, shouldMount } = useLazyMount({ rootMargin: "0px" });

  return (
    <div ref={sentinelRef} className="min-h-[760px]">
      {shouldMount ? (
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
