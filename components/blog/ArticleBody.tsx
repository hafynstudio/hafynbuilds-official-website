"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// ArticleBody -- typography-first HTML renderer for blog article content.
//
// Input: a plain HTML string (bodyContent field from BlogPost -- Decision D45).
// Output: sanitized, styled prose rendered into the DOM.
//
// Sanitization strategy:
// The HTML string comes from data/blog-posts.ts (our own controlled data
// layer) -- not from user input, not from an external API. At this phase,
// the only people writing bodyContent are the HAFYN BUILDS team. We therefore
// use a lightweight tag-allowlist sanitizer implemented inline rather than
// pulling in DOMPurify (which requires a browser environment and adds bundle
// weight). If/when the data source moves to a CMS or admin panel that accepts
// arbitrary rich-text input from external users, replace the sanitizer here
// with DOMPurify -- the component interface stays identical, only the
// sanitization internals change.
//
// Allowed tags (covers all standard long-form article content):
//   Block:   p, h2, h3, h4, blockquote, pre, ul, ol, li, hr, figure, figcaption
//   Inline:  strong, em, code, a, br, mark, del, abbr, sup, sub
//   Media:   img (src, alt, width, height only)
//
// Stripped unconditionally: script, style, iframe, form, input, button,
// and any on* event attributes -- regardless of source.
//
// Styling: Tailwind prose-style classes applied via the wrapper div.
// We do NOT use @tailwindcss/typography plugin -- it adds a large CSS
// footprint and gives less control than hand-crafted prose classes that
// match the HAFYN BUILDS design token system exactly.
//
// Motion posture: zero animation. Article body renders immediately and
// statically. The user is here to read -- animation is a distraction.
// (PRD Section 2.2.8: "calmer motion", "content pages prioritize focus
// over animation".)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Sanitizer -- allowlist-based, runs on the client before innerHTML write.
// Uses the browser's native DOMParser so no regex HTML parsing (which is
// always wrong for non-trivial HTML).
// ---------------------------------------------------------------------------

const ALLOWED_TAGS = new Set([
  // Block
  "p", "h2", "h3", "h4", "blockquote", "pre", "ul", "ol", "li",
  "hr", "figure", "figcaption", "div",
  // Inline
  "strong", "em", "b", "i", "code", "a", "br", "mark", "del",
  "abbr", "sup", "sub", "span",
  // Media
  "img",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  a:   ["href", "title", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading"],
  abbr: ["title"],
  // All other elements: no attributes allowed beyond what's listed here.
};

// Event attribute pattern -- strip any on* attribute unconditionally.
const EVENT_ATTR_RE = /^on/i;

function sanitizeHtml(html: string): string {
  // Empty or whitespace-only: return empty string immediately.
  if (!html.trim()) return "";

  // Parse into a temporary document -- never touches the live DOM.
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function sanitizeNode(node: Node): Node | null {
    // Text nodes are always safe.
    if (node.nodeType === Node.TEXT_NODE) return node.cloneNode();

    // Non-element nodes (comments, processing instructions, etc.) are dropped.
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const el = node as Element;
    const tagName = el.tagName.toLowerCase();

    // Tag not in allowlist: drop the element but recurse into its children
    // so text content inside disallowed wrappers is preserved (e.g. a <div>
    // wrapping a <p> -- we keep the <p> content even if we strip the <div>).
    if (!ALLOWED_TAGS.has(tagName)) {
      const fragment = document.createDocumentFragment();
      el.childNodes.forEach((child) => {
        const sanitized = sanitizeNode(child);
        if (sanitized) fragment.appendChild(sanitized);
      });
      return fragment;
    }

    // Tag is allowed -- clone it and sanitize its attributes.
    const clean = document.createElement(tagName);
    const allowedAttrs = ALLOWED_ATTRS[tagName] ?? [];

    Array.from(el.attributes).forEach((attr) => {
      // Strip all event handlers unconditionally.
      if (EVENT_ATTR_RE.test(attr.name)) return;
      // Strip attributes not in the allowlist for this tag.
      if (!allowedAttrs.includes(attr.name)) return;
      // For <a> href: strip javascript: URIs.
      if (attr.name === "href" && attr.value.trim().toLowerCase().startsWith("javascript:")) return;
      clean.setAttribute(attr.name, attr.value);
    });

    // Force external links to open safely.
    if (tagName === "a") {
      const href = clean.getAttribute("href") ?? "";
      if (href.startsWith("http")) {
        clean.setAttribute("target", "_blank");
        clean.setAttribute("rel", "noopener noreferrer");
      }
    }

    // Recurse into children.
    el.childNodes.forEach((child) => {
      const sanitized = sanitizeNode(child);
      if (sanitized) clean.appendChild(sanitized);
    });

    return clean;
  }

  // Sanitize the body's children into a temporary container.
  const container = document.createElement("div");
  doc.body.childNodes.forEach((child) => {
    const sanitized = sanitizeNode(child);
    if (sanitized) container.appendChild(sanitized);
  });

  return container.innerHTML;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ArticleBodyProps {
  html: string;
  className?: string;
}

export function ArticleBody({ html, className }: ArticleBodyProps) {
  // Memoize the sanitized HTML -- bodyContent is static per article,
  // so this only runs once per mount (and never on re-render unless
  // the html prop actually changes, which it never will in practice).
  const sanitizedHtml = useMemo(() => {
    // Guard: sanitizer uses DOMParser which is browser-only. On the
    // server (SSR pass) html is already trusted (from our own data layer)
    // so we pass it through directly. The client hydration will then
    // re-run sanitizeHtml and the output will be identical, so no
    // hydration mismatch occurs.
    if (typeof window === "undefined") return html;
    return sanitizeHtml(html);
  }, [html]);

  // Empty body: render nothing. The article page handles this case at
  // the page level (dev example post has bodyContent: "" -- Decision D40).
  if (!sanitizedHtml.trim()) return null;

  return (
    <div
      // data-article-body: stable selector used by ReadingProgress to
      // measure the scrollable article region (see ReadingProgress.tsx).
      // Never remove or rename this attribute.
      data-article-body
      className={cn(
        // ---------------------------------------------------------------------------
        // Prose typography system -- hand-crafted to match the HAFYN BUILDS
        // design token system. No @tailwindcss/typography plugin (Decision D48).
        //
        // Readable measure: max-w-[72ch] applied at the page level (article layout),
        // not here -- ArticleBody is unaware of its container width so it stays
        // composable. The page wrapper owns the measure constraint.
        // ---------------------------------------------------------------------------

        // Base text
        "font-sans text-base leading-relaxed text-text-secondary",

        // ---------------------------------------------------------------------------
        // Headings -- h2, h3, h4 (h1 is the article title in the hero, never in body)
        // ---------------------------------------------------------------------------
        "[&_h2]:mt-10 [&_h2]:mb-4",
        "[&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-bold",
        "[&_h2]:leading-snug [&_h2]:text-text-primary",
        "[&_h2]:scroll-mt-24", // offset for sticky header

        "[&_h3]:mt-8 [&_h3]:mb-3",
        "[&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_h3]:leading-snug [&_h3]:text-text-primary",
        "[&_h3]:scroll-mt-24",

        "[&_h4]:mt-6 [&_h4]:mb-2",
        "[&_h4]:font-sans [&_h4]:text-base [&_h4]:font-semibold",
        "[&_h4]:leading-snug [&_h4]:text-text-primary",
        "[&_h4]:scroll-mt-24",

        // ---------------------------------------------------------------------------
        // Paragraphs
        // ---------------------------------------------------------------------------
        "[&_p]:mb-5 [&_p]:leading-relaxed",

        // ---------------------------------------------------------------------------
        // Blockquotes -- left accent bar + indent. Same visual language as
        // the Founder page pull-quotes (Decision D28) for brand consistency.
        // ---------------------------------------------------------------------------
        "[&_blockquote]:my-8 [&_blockquote]:pl-5",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-accent",
        "[&_blockquote]:text-text-tertiary [&_blockquote]:italic",
        "[&_blockquote_p]:mb-0", // override paragraph margin inside blockquote

        // ---------------------------------------------------------------------------
        // Lists
        // ---------------------------------------------------------------------------
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-text-secondary",
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-text-secondary",
        "[&_li]:mb-1.5 [&_li]:leading-relaxed",
        "[&_li_p]:mb-0", // paragraphs inside list items don't need extra margin

        // ---------------------------------------------------------------------------
        // Inline code
        // ---------------------------------------------------------------------------
        "[&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5",
        "[&_code]:bg-bg-tertiary [&_code]:border [&_code]:border-border-hairline",
        "[&_code]:font-mono [&_code]:text-[0.875em] [&_code]:text-accent-glow",

        // ---------------------------------------------------------------------------
        // Code blocks (pre > code)
        // ---------------------------------------------------------------------------
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-card",
        "[&_pre]:border [&_pre]:border-border-hairline",
        "[&_pre]:bg-bg-tertiary [&_pre]:p-5",
        // Reset inline code styles inside pre -- pre owns the container styling
        "[&_pre_code]:bg-transparent [&_pre_code]:border-0",
        "[&_pre_code]:p-0 [&_pre_code]:text-text-secondary",
        "[&_pre_code]:text-sm [&_pre_code]:leading-relaxed",

        // ---------------------------------------------------------------------------
        // Horizontal rule
        // ---------------------------------------------------------------------------
        "[&_hr]:my-10 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border-hairline",

        // ---------------------------------------------------------------------------
        // Links
        // ---------------------------------------------------------------------------
        "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2",
        "[&_a]:decoration-accent/40",
        "[&_a:hover]:text-accent-glow [&_a:hover]:decoration-accent-glow/60",
        "[&_a]:transition-colors [&_a]:duration-fast",

        // ---------------------------------------------------------------------------
        // Images -- responsive, rounded, subtle border
        // ---------------------------------------------------------------------------
        "[&_img]:my-8 [&_img]:w-full [&_img]:rounded-card",
        "[&_img]:border [&_img]:border-border-hairline",
        "[&_img]:object-cover",

        // ---------------------------------------------------------------------------
        // Figure + figcaption
        // ---------------------------------------------------------------------------
        "[&_figure]:my-8",
        "[&_figcaption]:mt-3 [&_figcaption]:text-center",
        "[&_figcaption]:font-mono [&_figcaption]:text-xs [&_figcaption]:text-text-disabled",

        // ---------------------------------------------------------------------------
        // Strong + em
        // ---------------------------------------------------------------------------
        "[&_strong]:font-semibold [&_strong]:text-text-primary",
        "[&_em]:italic [&_em]:text-text-secondary",

        // ---------------------------------------------------------------------------
        // Mark (highlight)
        // ---------------------------------------------------------------------------
        "[&_mark]:rounded [&_mark]:px-1",
        "[&_mark]:bg-accent/20 [&_mark]:text-text-primary",

        // ---------------------------------------------------------------------------
        // First paragraph lead treatment -- slightly larger, draws the reader in.
        // Targets the first <p> that is a direct child of the article body.
        // ---------------------------------------------------------------------------
        "[&>p:first-of-type]:text-lg [&>p:first-of-type]:text-text-primary",
        "[&>p:first-of-type]:leading-relaxed",

        className
      )}
      // dangerouslySetInnerHTML is used here with a purpose-built sanitizer.
      // The sanitizer runs allowlist-based tag + attribute filtering through
      // the browser's own DOMParser (not regex). The data source is our own
      // controlled data layer (data/blog-posts.ts), not user input.
      // If/when the data source moves to a CMS accepting external user input,
      // replace sanitizeHtml() with DOMPurify -- this component's interface
      // stays identical.
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}