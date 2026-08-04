// ---------------------------------------------------------------------------
// Canonical production identity — SINGLE SOURCE OF TRUTH.
//
// Current live/canonical production domain: the Vercel deployment URL.
// hafynbuilds.com is a FUTURE custom domain only — it is not yet registered
// or configured and must not be used as the current production identity.
// When it is purchased and migrated it becomes a separate project. Until
// then, every module that identifies HAFYN's website must import SITE_URL
// from here rather than hardcoding a domain.
// ---------------------------------------------------------------------------
export const SITE_URL = "https://hafynbuilds.vercel.app";
export const SITE_NAME = "HAFYN BUILDS";
