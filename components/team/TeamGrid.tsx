"use client";

/**
 * TeamGrid — Team page (PRD §2.2.3).
 *
 * Consumes data/team.ts. Filters out the founder (already featured
 * separately in FounderSpotlight above). Grid renders however many
 * real team members exist — 0, 2, 4 — no fake placeholders per the
 * Master Prompt's "no fake content" rule.
 *
 * EMPTY STATE (data/team.ts currently returns [] — real members pending
 * per PRD §5): renders an honest "team page expanding" state, NOT a
 * broken card grid. Structured so real members drop in via data file
 * only — this component never needs to change.
 *
 * Card treatment: premium glass surface, photo (or initials fallback),
 * name, role, one-line specialty. Consistent visual language with
 * the Founder Spotlight above but visibly smaller/quieter — the
 * spotlight must remain the hero of the page.
 */

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { team } from "@/data/team";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { TeamMember } from "@/types/team-member";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function MemberCard({
  member,
  index,
  rm,
}: {
  member: TeamMember;
  index: number;
  rm: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });
  const [imgError, setImgError] = useState(false);

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: rm ? 0 : 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(160deg, rgb(18 18 22) 0%, rgb(12 12 16) 100%)",
        border: "1px solid rgb(255 255 255 / 0.06)",
      }}
    >
      {/* Top accent — draws on entry */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: index * 0.08 + 0.15, ease: EASE }}
        style={{
          background:
            "linear-gradient(to right, rgb(62 123 250 / 0.7), rgb(34 211 238 / 0.25), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgb(62 123 250 / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Portrait */}
      <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
        {member.photoUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={`${member.name} — ${member.role}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: "50% 22%" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgb(22 22 28) 0%, rgb(14 14 18) 100%)",
            }}
          >
            <span
              className="font-mono text-5xl font-bold"
              style={{ color: "rgb(62 123 250 / 0.35)" }}
              aria-hidden="true"
            >
              {initials}
            </span>
          </div>
        )}

        {/* Bottom fade */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(to top, rgb(12 12 16) 0%, rgb(12 12 16 / 0.5) 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Info */}
      <div className="relative p-5 sm:p-6">
        <p className="text-lg font-bold tracking-tight text-text-primary">
          {member.name}
        </p>
        <p
          className="mt-1 text-xs font-semibold tracking-wide"
          style={{ color: "rgb(34 211 238 / 0.85)" }}
        >
          {member.role}
        </p>

        <div
          className="my-4 h-px"
          style={{
            background:
              "linear-gradient(to right, rgb(62 123 250 / 0.18), transparent)",
          }}
          aria-hidden="true"
        />

        <p className="text-sm leading-relaxed text-text-tertiary">
          {member.specialty}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Empty state — renders when data/team.ts has no non-founder members.
 * Honest copy per Master Prompt: no fake placeholders, no "coming soon"
 * theater, just clear acknowledgement that this section is expanding.
 * Structure preserved so the grid drops in cleanly once real data lands.
 */
function EmptyState() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-12 sm:py-20"
      style={{
        background:
          "linear-gradient(160deg, rgb(18 18 22) 0%, rgb(12 12 16) 100%)",
        border: "1px dashed rgb(62 123 250 / 0.2)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgb(62 123 250 / 0.05) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div
          className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{
            background: "rgb(62 123 250 / 0.08)",
            border: "1px solid rgb(62 123 250 / 0.2)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "rgb(var(--color-accent-primary))" }}
            aria-hidden="true"
          />
          <span
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "rgb(var(--color-accent-primary))" }}
          >
            Team expanding
          </span>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          More builders,{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-accent-glow)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            joining soon.
          </span>
        </h3>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
          The HAFYN BUILDS team is deliberately small and deliberately
          senior. New members are announced here only after they have
          shipped alongside the founder.
        </p>
      </div>
    </div>
  );
}

export function TeamGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const rm = usePrefersReducedMotion();
  const headerInView = useInView(sectionRef, { once: true, margin: "-60px" });

  // Founder is featured separately in FounderSpotlight — never duplicate here
  const members = team
    .filter((m) => !m.isFounder)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const hasMembers = members.length > 0;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "rgb(8 8 10)",
        borderTop: "1px solid rgb(255 255 255 / 0.05)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgb(62 123 250 / 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">

        {/* Section header */}
        <div className="mb-12 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: rm ? 0 : 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-4 flex items-center gap-3"
          >
            <div
              className="h-px w-8 rounded-full"
              style={{ background: "rgb(var(--color-accent-primary))" }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "rgb(var(--color-accent-primary))" }}
            >
              The Team
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: rm ? 0 : 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
          >
            Builders behind{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-accent-glow)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              every ship.
            </span>
          </motion.h2>
        </div>

        {/* Grid OR empty state — never a broken hybrid */}
        {hasMembers ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                index={i}
                rm={rm}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
