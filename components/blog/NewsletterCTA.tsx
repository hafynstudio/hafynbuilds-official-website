"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

// ─── Component ───────────────────────────────────────────────────────────────
// Newsletter UI slot reserved in Phase 14 per PRD §2.2.8 ("subtle,
// optional"). Backend wiring intentionally deferred — this preserves the
// page's visual hierarchy now without inventing scope around data
// storage, consent flows, or email provider integration.

export function NewsletterCTA() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="pt-4 md:pt-6"
    >
      <Card
        padding="lg"
        className="relative overflow-hidden border-border-hairline bg-bg-elevated"
      >
        {/* Ambient accent glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(62,123,250,0.12),transparent_55%)]"
        />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              Optional
            </span>
            <h2
              id="newsletter-heading"
              className="mt-3 font-sans text-2xl font-semibold leading-tight text-text-primary md:text-3xl"
            >
              Get the sharp stuff. Skip the noise.
            </h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-text-secondary md:text-base">
              Engineering notes, AI insights, product thinking, and lessons
              from real builds — sent only when there’s something actually
              worth reading.
            </p>
          </div>

          {/* UI only — no submit handler yet */}
          <form
            className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              id="newsletter-email"
              name="newsletterEmail"
              type="email"
              label="Email address"
              autoComplete="email"
              required
            />
            <div className="md:self-end">
              <Button type="submit">
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
}
