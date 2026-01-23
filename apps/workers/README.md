# Background Workers

This folder contains background workers — queue processors, cron jobs, event handlers, and ETL pipelines.

## Adding a New Worker

1. Create a folder for your worker:
   ```bash
   mkdir apps/workers/my-worker
   cd apps/workers/my-worker
   ```

2. Initialize with your preferred setup:
   ```bash
   pnpm init
   ```

3. Set up `package.json`:
   ```json
   {
     "name": "@squared-agent/my-worker",
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

## Suggested Libraries

| Library | Use Case |
|---------|----------|
| **BullMQ** | Redis-backed job queues |
| **Temporal** | Workflow orchestration |
| **node-cron** | Scheduled tasks |
| **inngest** | Event-driven functions |

## Using Shared Packages

Import from workspace packages:
```typescript
import { someUtility } from '@squared-agent/core';
```
