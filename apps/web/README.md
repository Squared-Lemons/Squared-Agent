# Web Applications

This folder contains web applications — dashboards, admin panels, documentation sites, and landing pages.

## Adding a New Web App

1. Create a folder for your app:
   ```bash
   mkdir apps/web/my-app
   cd apps/web/my-app
   ```

2. Initialize your app (example with Next.js):
   ```bash
   pnpm create next-app . --typescript --tailwind --eslint --app --src-dir
   ```

3. Update `package.json` with the workspace name:
   ```json
   {
     "name": "@squared-agent/my-app",
     ...
   }
   ```

4. Add scripts for Turborepo:
   ```json
   {
     "scripts": {
       "build": "next build",
       "dev": "next dev",
       "lint": "next lint",
       "type-check": "tsc --noEmit"
     }
   }
   ```

5. Install dependencies from the root:
   ```bash
   cd ../../..
   pnpm install
   ```

## Suggested Frameworks

| Framework | Use Case |
|-----------|----------|
| **Next.js** | Full-stack web apps, SSR/SSG sites |
| **Vite + React** | SPAs, dashboards |
| **Astro** | Documentation, content-heavy sites |
| **Remix** | Full-stack apps with nested routing |

## Using Shared Packages

Import from workspace packages:
```typescript
import { someUtility } from '@squared-agent/core';
```
