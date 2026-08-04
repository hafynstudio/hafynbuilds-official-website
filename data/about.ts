import type { OriginStoryContent } from "@/types/about";
import type {
  StatementSection,
  MissionPrinciple,
  EcosystemPreviewItem,
  EcosystemDiagramContent,
  BuildStandard,
} from "@/types/about";

/**
 * About-page content remains isolated from presentation so it can move
 * into the future admin-managed data layer without component changes.
 *
 * The narrative deliberately avoids unsupported dates, milestones, and
 * biographical claims while the founder's extended story is still pending.
 */
export const originStory = {
  sectionLabel: "Origin / Why we exist",

  heading: "Built from conviction. Designed to endure.",

  founderVoice:
    "I founded HAFYN BUILDS on a simple conviction: the most ambitious ideas deserve engineering that is equally ambitious — and execution disciplined enough to make them real.",

  body: [
    "We do not begin with a stack, a template, or a predetermined answer. We begin with the problem, the business behind it, and the standard the finished system must uphold.",
    "From there, we turn intent into architecture, architecture into working software, and working software into lasting capability. Every layer is deliberate. Every decision has a reason.",
  ],

  principle:
    "The goal was never to produce more software. It was to build what moves a business forward.",

  blueprint: {
    projectLabel: "HAFYN / BUILD SYSTEM 001",
    statusLabel: "Structure active",
    coreLabel: "From intent to lasting impact",

    stages: [
      {
        id: "intent",
        index: "01",
        label: "Intent",
        description: "Define what must matter.",
      },
      {
        id: "architecture",
        index: "02",
        label: "Architecture",
        description: "Design the system to endure.",
      },
      {
        id: "execution",
        index: "03",
        label: "Execution",
        description: "Build with precision and ownership.",
      },
      {
        id: "impact",
        index: "04",
        label: "Impact",
        description: "Ship capability that moves forward.",
      },
    ],

    accessibleDescription:
      "An architectural blueprint illustrating the HAFYN BUILDS process rising from intent through architecture and execution to lasting impact.",
  },
} satisfies OriginStoryContent;

/**
 * Mission & Vision — two distinct full-bleed statement sections (PRD §2.2.2).
 * Mission is present-tense/grounded ("what we do now"); Vision is
 * future-tense/aspirational ("where this leads"). Kept as short,
 * quotable statements rather than paragraphs, per the "statement
 * section" requirement — this is not body copy.
 */
export const statementSections: readonly StatementSection[] = [
  {
    id: "mission",
    eyebrow: "Mission",
    statement:
      "Engineer software that businesses can build their future on.",
    supportingLine:
      "Every system we ship is judged by one standard: does it hold up under real weight, for years, not just at launch.",
  },
  {
    id: "vision",
    eyebrow: "Vision",
    statement:
      "A world where ambitious ideas are never limited by engineering.",
    supportingLine:
      "HAFYN BUILDS is the first proof point of a larger ecosystem — one built to remove the ceiling between what a business imagines and what it can actually run.",
  },
] as const;

/**
 * Mission's supporting visual — 3 short principle callouts that
 * reinforce the mission statement without restating it. Deliberately
 * terse (2-3 words) per spec, not full sentences.
 */
export const missionPrinciples: readonly MissionPrinciple[] = [
  { id: "scale", label: "Built for scale", icon: "layers" },
  { id: "durability", label: "Engineered to last", icon: "shield" },
  { id: "integrity", label: "Zero shortcuts", icon: "ban" },
] as const;

/**
 * Vision's supporting visual — a muted preview of future HAFYN
 * subsidiaries. This intentionally mirrors the "ghosted / coming soon"
 * subsidiary list that EcosystemDiagram will render in full later in
 * this page — here it's a light teaser, not the full diagram.
 */
export const ecosystemPreview: readonly EcosystemPreviewItem[] = [
  { id: "ai", name: "HAFYN AI" },
  { id: "cloud", name: "HAFYN Cloud" },
  { id: "os", name: "HAFYN OS" },
  { id: "robotics", name: "HAFYN Robotics" },
  { id: "security", name: "HAFYN Security" },
  { id: "labs", name: "HAFYN Labs" },
] as const;

/**
 * HAFYN Ecosystem diagram (PRD §2.2.2) — animated org chart paying off
 * the muted pill-teaser shown at the end of the Vision section above.
 * HAFYN BUILDS is the only live operating company today; every
 * subsidiary listed is explicitly future/ghosted — no dates or launch
 * commitments are implied, per the no-fabricated-claims rule.
 */
export const ecosystemDiagram = {
  eyebrow: "The Ecosystem",
  heading: "One holding company. A growing constellation of builds.",
  supportingLine:
    "HAFYN BUILDS is the first live company under the HAFYN umbrella — proof of how the rest of the ecosystem will be engineered.",

  root: {
    name: "HAFYN",
    subtitle: "Technology holding company",
  },

  activeNode: {
    name: "HAFYN BUILDS",
    badge: "You are here",
    subtitle: "Software engineering & AI",
  },

  subsidiaries: [
    { id: "ai", name: "HAFYN AI", focus: "Applied AI systems" },
    { id: "cloud", name: "HAFYN Cloud", focus: "Infrastructure & hosting" },
    { id: "os", name: "HAFYN OS", focus: "Platform & operating layer" },
    { id: "robotics", name: "HAFYN Robotics", focus: "Physical automation" },
    { id: "security", name: "HAFYN Security", focus: "Systems & data security" },
    { id: "labs", name: "HAFYN Labs", focus: "Research & new ventures" },
  ],

  statusLabel: "Coming soon",

  accessibleDescription:
    "An organizational diagram showing HAFYN as the parent holding company, with HAFYN BUILDS as the active operating company beneath it, and six future subsidiaries — HAFYN AI, HAFYN Cloud, HAFYN OS, HAFYN Robotics, HAFYN Security, and HAFYN Labs — shown as upcoming ventures not yet launched.",
} satisfies EcosystemDiagramContent;

/**
 * Build Standards (PRD §2.2.2) — bold statement + supporting tags.
 * NOT a checklist. Each standard is a declaration, not a bullet point.
 * Tags are short, monospace-style stamps — scannable at a glance.
 * The section reads as "this is how we operate" not "here is our list."
 */
export const buildStandards: readonly BuildStandard[] = [
  {
    id: "performance",
    declaration: "Fast by architecture, not by accident.",
    tags: ["Sub-second load", "GPU-only animation", "Core Web Vitals"],
    icon: "zap",
  },
  {
    id: "security",
    declaration: "Security is designed in. Never bolted on.",
    tags: ["Security-by-design", "Zero trust", "Hardened by default"],
    icon: "shield",
  },
  {
    id: "scalability",
    declaration: "Built for where you are going, not where you are.",
    tags: ["Scales to demand", "No ceiling", "Growth-ready"],
    icon: "layers",
  },
  {
    id: "architecture",
    declaration: "Clean architecture is not optional at this level.",
    tags: ["Separation of concerns", "Maintainable", "No technical debt"],
    icon: "cpu",
  },
  {
    id: "ai",
    declaration: "AI is a first-class citizen in every system we build.",
    tags: ["AI-native thinking", "Automation-first", "LLM-ready"],
    icon: "brain",
  },
  {
    id: "ownership",
    declaration: "We own the outcome, not just the deliverable.",
    tags: ["Post-launch care", "Outcome-driven", "Full accountability"],
    icon: "anchor",
  },
] as const;
