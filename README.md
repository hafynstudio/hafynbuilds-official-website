# HAFYN BUILDS — Official Website

Flagship marketing site for HAFYN BUILDS, the software engineering & AI
company under the HAFYN technology holding group.

Built per `HAFYN-BUILDS-Website-PRD-TAD.md` and the 20-phase build
roadmap. See the latest phase handoff document for current build status.

**Status:** Production build complete (all 9 pages, design system,
animation, SEO, accessibility, performance) + Phase 2 production
hardening applied.

**Phase 2 notes:**
- Lead delivery: `POST /api/contact` only reports success after the
  submission is accepted by a configured delivery target. Set the
  `CONTACT_DELIVERY_WEBHOOK_URL` environment variable in production
  (see `app/api/contact/route.ts`). Without it the API returns an honest
  503 and the UI shows a failure state — it never fakes a "sent" message.
- Security headers (CSP, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy, X-Frame-Options, HSTS) are configured in
  `next.config.ts`.
- Canonical production domain: `https://hafynbuilds.vercel.app` (defined
  once in `lib/site.ts`). `hafynbuilds.com` is a future custom domain that
  is not yet registered; when purchased it will be migrated as a separate
  project (register → DNS → Vercel custom domain → redirect → canonical).
