"use client";

import { motion } from "framer-motion";
import { MessageSquare, Video, FileText, Bell } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const PROMISES = [
  {
    icon: Video,
    title: "Weekly demos",
    description: "Every active build week ends with a working demo — not a status update. You see real progress, not slides.",
    accent: "62 123 250",
  },
  {
    icon: MessageSquare,
    title: "Async-first updates",
    description: "Written updates before calls. We respect your time — every sync has an agenda and produces a decision.",
    accent: "168 85 247",
  },
  {
    icon: FileText,
    title: "Full documentation",
    description: "Every system we build ships with real documentation. You own the knowledge, not just the code.",
    accent: "34 211 238",
  },
  {
    icon: Bell,
    title: "No surprises",
    description: "If a timeline shifts or a decision needs to be made, you hear about it immediately — not at the deadline.",
    accent: "34 197 94",
  },
] as const;

/**
 * Communication promise section — addresses enterprise buyer concern
 * about "going dark" during long builds. PRD §2.2.5 requirement.
 */
export function CommunicationSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      className="mx-auto max-w-5xl px-5 py-20 sm:px-8 lg:px-12"
      aria-labelledby="comms-heading"
    >
      <div className="mb-12 text-center">
        <p
          className="mb-3 font-mono text-xs uppercase tracking-widest"
          style={{ color: "rgb(62 123 250 / 0.75)" }}
          aria-hidden="true"
        >
          Communication Promise
        </p>
        <h2
          id="comms-heading"
          className="text-3xl font-bold text-text-primary sm:text-4xl"
        >
          You will always know<br className="hidden sm:block" /> where your build stands.
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {PROMISES.map((promise, i) => {
          const Icon = promise.icon;
          return (
            <motion.div
              key={promise.title}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.5, ease: EASE_OUT_EXPO, delay: i * 0.09 }
              }
              className="group rounded-xl border p-6 transition-colors duration-300"
              style={{
                borderColor: "rgb(42 42 49)",
                backgroundColor: "rgb(15 15 17)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04) inset",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `rgb(${promise.accent} / 0.30)`;
                (e.currentTarget as HTMLElement).style.backgroundColor = `rgb(${promise.accent} / 0.04)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgb(42 42 49)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgb(15 15 17)";
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border"
                style={{
                  borderColor: `rgb(${promise.accent} / 0.25)`,
                  backgroundColor: `rgb(${promise.accent} / 0.10)`,
                }}
                aria-hidden="true"
              >
                <Icon size={18} style={{ color: `rgb(${promise.accent})` }} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-text-primary sm:text-lg">
                {promise.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {promise.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
