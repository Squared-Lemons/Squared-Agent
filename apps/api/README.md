# API Services

This folder contains API services — REST APIs, GraphQL servers, tRPC endpoints, and webhooks.

## Adding a New API

1. Create a folder for your API:
   ```bash
   mkdir apps/api/my-api
   cd apps/api/my-api
   ```

2. Initialize with your preferred framework:
   ```bash
   pnpm init
   ```

3. Set up `package.json`:
   ```json
   {
     "name": "@squared-agent/my-api",
     "version": "0.0.0",
     "private": true,
     "scripts": {
       "build": "tsup src/index.ts",
       "dev": "tsx watch src/index.ts",
       "start": "node dist/index.js",
       "type-check": "tsc --noEmit"
     }
   }
   ```

4. Install dependencies from the root:
   ```bash
   cd ../../..
   pnpm install
   ```

## Suggested Frameworks

| Framework | Use Case |
|-----------|----------|
| **Hono** | Lightweight, edge-ready APIs |
| **Express** | Traditional Node.js APIs |
| **Fastify** | High-performance APIs |
| **tRPC** | End-to-end typesafe APIs |
| **GraphQL Yoga** | GraphQL servers |

## Using Shared Packages

Import from workspace packages:
```typescript
import { someUtility } from '@squared-agent/core';
```
