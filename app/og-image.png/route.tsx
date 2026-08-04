// ---------------------------------------------------------------------------
// OG image route — serves a branded 1200x630 Open Graph image at
// /og-image.png. Uses Next.js ImageResponse (built on Satori) so no
// static asset is needed and the image is generated at request time
// with zero external dependencies.
//
// This is the DEFAULT og image used by buildMetadata() as the fallback
// for all pages that don't supply a page-specific cover image. Individual
// blog articles with real cover images override this via buildArticleMetadata().
//
// TODO(Phase 20 / post-launch): replace this with a real branded static
// asset (/public/og-image.png) designed by the brand team. The route
// approach works perfectly for launch and can be swapped at any time
// by simply adding the static file — Next.js will serve the static file
// over this route automatically.
// ---------------------------------------------------------------------------

import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";

export const runtime = "edge";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#0A0A0B",
          padding: "72px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Grain texture overlay — subtle, matches site aesthetic */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Accent glow — top right */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Bottom left glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Horizontal rule */}
        <div
          style={{
            position: "absolute",
            bottom: "160px",
            left: "80px",
            right: "80px",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Content — sits above the rule */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#38BDF8",
              margin: 0,
              fontWeight: 500,
            }}
          >
            HAFYN BUILDS
          </p>

          {/* Main headline */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#F8FAFC",
              margin: 0,
              maxWidth: "800px",
            }}
          >
            Engineering the Impossible.
          </h1>

          {/* Sub-headline */}
          <p
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "rgba(248,250,252,0.5)",
              margin: 0,
            }}
          >
            Building What Matters.
          </p>
        </div>

        {/* Bottom row — URL */}
        <p
          style={{
            position: "absolute",
            bottom: "48px",
            left: "80px",
            fontSize: "14px",
            color: "rgba(248,250,252,0.3)",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          {SITE_URL.replace(/^https?:\/\//, "")}
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}