import type { BlogPost } from "@/types/blog-post";

const REAL_POSTS: BlogPost[] = [
  {
    slug: "engineering-systems-that-last",
    title: "Engineering Systems That Last: Architecture Decisions That Matter",
    excerpt:
      "A deep dive into the architectural decisions, trade-offs, and engineering philosophy behind the systems we build at HAFYN BUILDS — and why clean architecture is the only path to long-term reliability.",
    bodyContent: `
      <p>Great software is never the result of shortcuts. It is the result of thoughtful architecture, disciplined execution, relentless refinement, and uncompromising attention to detail.</p>

      <h2>Why Architecture Decisions Are Permanent</h2>
      <p>Most engineering teams treat architecture as a preliminary step — something you do once before the "real" work begins. This is exactly backwards. Architecture decisions are the most permanent decisions you will make on any project. Every line of code written after them is constrained by them.</p>

      <blockquote>
        <p>Build it once. Build it right. Build it to last.</p>
      </blockquote>

      <h2>The Cost of Shortcuts</h2>
      <p>Shortcuts compound. A decision to skip proper separation of concerns in week one becomes a decision to rewrite the entire system in month six. We have seen this pattern destroy projects that had every other ingredient for success — good teams, real budgets, motivated clients.</p>

      <h3>What We Do Instead</h3>
      <p>At HAFYN BUILDS, every project begins with an architecture review before a single line of production code is written. We ask:</p>

      <ul>
        <li>What does this system need to do in three years, not just today?</li>
        <li>Where are the natural seams in the domain model?</li>
        <li>What failure modes are we designing against?</li>
        <li>Where will load concentrate, and how do we distribute it?</li>
      </ul>

      <h2>Performance Is Not a Feature</h2>
      <p>Performance is not something you add to a system. It is something you design into a system from the first decision. A system that is slow by architecture cannot be made fast by optimization — you can only ever recover a fraction of what was lost at the design stage.</p>

      <pre><code>// Measure first. Optimize the bottleneck. Measure again.
// Never optimize what you have not measured.
const result = await measureAsync(() => expensiveOperation());</code></pre>

      <h2>Closing Thought</h2>
      <p>The systems we are most proud of are not the ones that launched fastest. They are the ones that are still running cleanly, still scaling predictably, and still being extended by their teams years after we handed them over. That is the standard we build to.</p>
    `,
    coverImage: "",
    category: "Engineering",
    tag: "deep-dive",
    publishedAt: new Date().toISOString(),
    authorId: "zain-marwat",
    readTimeMinutes: 8,
  },
];

const DEV_EXAMPLE_POST: BlogPost = {
  slug: "dev-example-post",
  title: "Engineering at Scale: How We Architect Systems That Last",
  excerpt:
    "A deep dive into the architectural decisions, trade-offs, and engineering philosophy behind the systems we build at HAFYN BUILDS — and why we believe clean architecture is the only path to long-term reliability.",
  bodyContent: "",
  coverImage: "",
  category: "Engineering",
  tag: "deep-dive",
  publishedAt: new Date().toISOString(),
  authorId: "zain-marwat",
  readTimeMinutes: 12,
};

export const blogPosts: BlogPost[] =
  process.env.NODE_ENV === "development"
    ? [...REAL_POSTS, DEV_EXAMPLE_POST]
    : REAL_POSTS;

export interface BlogCategory {
  label: string;
  slug: string;
  value: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { label: "Engineering", slug: "engineering",  value: "Engineering"  },
  { label: "AI",          slug: "ai",           value: "AI"           },
  { label: "Design",      slug: "design",       value: "Design"       },
  { label: "Business",    slug: "business",     value: "Business"     },
  { label: "Case Studies",slug: "case-studies", value: "Case Studies" },
];

export function getPostsByCategory(categoryValue: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === categoryValue);
}

export function getFeaturedPost(): BlogPost | null {
  if (blogPosts.length === 0) return null;
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0];
}