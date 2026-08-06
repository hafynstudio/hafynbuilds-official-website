# HAFYN BUILDS — Official Website

Flagship marketing site for HAFYN BUILDS, the software engineering & AI
company under the HAFYN technology holding group.

Built per `HAFYN-BUILDS-Website-PRD-TAD.md` and the 20-phase build
roadmap. See the latest phase handoff document for current build status.

**Status:** Production build complete (all 9 pages, design system,
animation, SEO, accessibility, performance) + Phase 2 production
hardening applied.

**Phase 2 notes:**
- Lead delivery: `POST /api/contact` validates server-side, rate-limits,
  and sends the lead as an email via Resend. It only reports success after
  Resend acknowledges the email. Required environment variables:
  `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (test default
  `HAFYN <onboarding@resend.dev>`), `RESEND_TO_EMAIL` (test default
  `delivered@resend.dev`) — see `.env.example`. Without a key the API
  returns an honest 500 and the UI shows a failure state — it never fakes
  a "sent" message. The Resend key is server-side only.
- Security headers (CSP, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy, X-Frame-Options, HSTS) are configured in
  `next.config.ts`.
- Canonical production domain: `https://hafynbuilds.vercel.app` (defined
  once in `lib/site.ts`). `hafynbuilds.com` is a future custom domain that
  is not yet registered; when purchased it will be migrated as a separate
  project (register → DNS → Vercel custom domain → redirect → canonical).
