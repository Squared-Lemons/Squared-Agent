# Creator Feedback - Gym Master - 2026-01-20

## Knowledge Gaps

- **Next.js 16 proxy migration** - The knowledge docs mention middleware.ts
  but Next.js 16 has deprecated this. Should document the rename to proxy.ts
  and the function rename from `middleware()` to `proxy()`.

- **Better Auth navigation gotcha** - Using `router.push()` + `router.refresh()`
  after auth actions causes a "regenerating" freeze. The pattern should be
  `window.location.href` for full page navigation after auth state changes.
  This should be added to the Next.js knowledge doc.

## Setup Issues

- **pnpm-workspace.yaml conflict** - The spawned project had a pnpm-workspace.yaml
  that wasn't needed and caused confusion. Consider not including this in
  single-project templates.

## New Patterns

- **Session helper with org context** - Created `getSessionWithOrg()` helper
  that returns user + organization in one call. Good pattern for multi-tenant
  apps that could be templated.

- **QR code as data URL** - Simple approach storing QR as data URL in member
  record avoids file storage complexity for v1 prototypes.

## Technical Gotchas

- **Browser automation intermittent failures** - claude-in-chrome MCP has
  intermittent "Cannot access chrome-extension:// URL" errors during click/
  screenshot actions. Form inputs and navigation work reliably. May need
  fallback patterns or retry logic documented.

- **Better Auth table names** - Must be singular (user, session, account) not
  plural. The Drizzle schema examples should emphasize this.

- **Next.js 16 Turbopack** - Now the default. serverExternalPackages config
  still needed for better-sqlite3.
