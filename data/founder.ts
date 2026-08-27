import type { FounderProfile } from "@/types/founder";

// Real founder content (Phase 13). Only real social profile URLs
// (data/social-links.ts) remain pending -- see PRD Section 5.
export const founder: FounderProfile = {
  name: "Zain Marwat",
  title: "Founder, Director & CEO",
  tagline:
    "We don't build software to launch it. We build systems that still create value years later.",
  photoUrl: "/images/founder.webp",
  isTaglinePlaceholder: false,

  eyebrow: "Meet the Founder",

  openingStatement:
    "Technology has never been just about writing code. It's about solving meaningful problems, creating lasting value, and building systems that move people and businesses forward.",

  narrative: [
    {
      type: "prose",
      id: "the-beginning",
      heading: "The Beginning",
      paragraphs: [
        "I'm Zain Marwat, the Founder and CEO of HAFYN. I started programming at the age of eleven as a self-taught developer, driven by curiosity rather than formal education. What began as countless hours of learning, experimenting, and building gradually evolved into a clear mission: to create technology that delivers real competitive advantage.",
        "Today, HAFYN designs and engineers premium websites, intelligent web applications, SaaS platforms, AI-powered products, and custom digital systems that help ambitious companies grow faster, operate smarter, and compete at a higher level.",
      ],
    },
    {
      type: "quote",
      id: "quote-founding-belief",
      quote:
        "Businesses deserve technology built for growth -- not just software that works.",
      context: "On founding HAFYN -- June 1, 2026",
    },
    {
      type: "prose",
      id: "why-hafyn-exists",
      heading: "Why HAFYN Exists",
      paragraphs: [
        "Every day, thousands of businesses struggle with outdated systems, weak digital experiences, and technology that limits growth instead of accelerating it.",
        "HAFYN was created to change that. We don't chase trends. We build digital products that remain valuable long after launch -- products engineered with clarity, performance, scalability, and long-term business impact in mind. For us, every project is an opportunity to create something exceptional.",
      ],
    },
    {
      type: "prose",
      id: "engineering-philosophy",
      heading: "Engineering Philosophy",
      paragraphs: [
        "Great software is never the result of shortcuts. It is the result of thoughtful architecture, disciplined execution, relentless refinement, and uncompromising attention to detail.",
        "At HAFYN, we believe that quality is remembered long after deadlines and invoices are forgotten. Every decision we make is guided by one principle:",
      ],
    },
    {
      type: "quote",
      id: "quote-build-it-right",
      quote: "Build it once. Build it right. Build it to last.",
      context: "Engineering Philosophy",
    },
    {
      type: "prose",
      id: "our-standards",
      heading: "Our Standards",
      paragraphs: [
        "Quality is not a feature. It is the foundation.",
        "We refuse to compromise on craftsmanship, reliability, performance, or user experience. If a project cannot meet the standards we believe our clients deserve, we would rather decline it than deliver something we are not proud to put our name on.",
      ],
    },
    {
      type: "quote",
      id: "quote-trust-earned",
      quote:
        "Trust is earned through consistency. Excellence is earned through discipline.",
      context: "Our Standards",
    },
    {
      type: "prose",
      id: "leadership",
      heading: "Leadership",
      paragraphs: [
        "I believe great companies are built by people who care deeply about their craft.",
        "Curiosity matters more than ego. Discipline matters more than talent. Learning matters more than titles.",
        "The goal isn't simply to build software. The goal is to build products that create measurable value for the people who use them.",
      ],
    },
    {
      type: "prose",
      id: "a-personal-note",
      heading: "A Personal Note",
      paragraphs: [
        "Everything I build is driven by a commitment to continuous improvement -- improving products, improving businesses, improving lives, and improving myself.",
        "The journey is only beginning. The vision is much larger than today's achievements. And the standard will always remain the same: Exceptional work. Every single time.",
      ],
    },
  ],

  ecosystemVision: {
    heading: "Looking Ahead",
    paragraphs: [
      "HAFYN is being built with a long-term vision. Not as another web agency. Not as another software company. But as a technology holding company that creates products, platforms, and intelligent systems capable of serving millions of people around the world.",
      "The ambition is simple: to build technology that becomes impossible to ignore.",
    ],
  },

  closingQuote: {
    quote: "I don't just build websites. I engineer digital products and systems that create advantage.",
    context: "Zain Marwat",
  },
};
