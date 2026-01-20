# Creator Feedback - Gym Master - 2026-01-20

## Knowledge Gaps

- **Next.js 16 proxy migration** - The knowledge docs mention middleware.ts
  but Next.js 16 has deprecated this. Should document the rename to proxy.ts
  and the function rename from `middleware()` to `proxy()`. Add to Next.js
  App Build Guide.

- **Better Auth navigation gotcha** - Using `router.push()` + `router.refresh()`
  after auth actions causes a "regenerating" freeze. The pattern should be
  `window.location.href` for full page navigation after auth state changes.
  This is critical for onboarding/login flows.

- **Better Auth table naming** - Must use singular table names (user, session,
  account) not plural. Drizzle examples should emphasize this requirement.

## Setup Issues

- **pnpm-workspace.yaml conflict** - The spawned project included a
  pnpm-workspace.yaml that wasn't needed for a single-project setup. Consider
  not including this in single-project templates, or add a note about when
  to remove it.

- **Missing .env.example** - Had to create this manually. Should be included
  in the template with placeholder values for required env vars.

## New Patterns

- **Session helper with org context** - Created `getSessionWithOrg()` helper
  in `src/lib/session.ts` that returns user + organization in one call. Good
  pattern for multi-tenant apps that could be templated.

- **QR code as data URL** - Simple approach storing QR as data URL in member
  record avoids file storage complexity for v1 prototypes. Good for MVPs.

- **Outbox/inbox pattern** - Created outbox/ folder for files going TO master
  agent, complementing inbox/ for files FROM master agent. Clear bidirectional
  communication pattern.

- **/creator-feedback command** - Standalone command to generate feedback
  anytime, with append/replace/skip options if file exists. Should be added
  to template commands.

## Technical Gotchas

- **Browser automation intermittent failures** - claude-in-chrome MCP has
  intermittent "Cannot access chrome-extension:// URL" errors during click/
  screenshot actions. Form inputs, navigation, and read_page work reliably.
  Workaround: retry or use JavaScript execution as fallback.

- **Next.js 16 Turbopack default** - Turbopack is now the default bundler.
  Still need `serverExternalPackages: ['better-sqlite3']` in next.config.ts
  for native modules.

- **Suspense boundary for useSearchParams** - Next.js 15+ requires wrapping
  components that use `useSearchParams()` in a Suspense boundary, even in
  client components. Error message is clear but easy to miss.
