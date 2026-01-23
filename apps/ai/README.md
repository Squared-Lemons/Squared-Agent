# AI Applications

This folder contains AI applications — agents, LLM pipelines, model runners, and RAG systems.

## Adding a New AI App

1. Create a folder for your app:
   ```bash
   mkdir apps/ai/my-agent
   cd apps/ai/my-agent
   ```

2. Initialize with your preferred setup:
   ```bash
   pnpm init
   ```

3. Set up `package.json`:
   ```json
   {
     "name": "@squared-agent/my-agent",
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
| **Anthropic SDK** | Claude API integration |
| **LangChain** | LLM application framework |
| **Vercel AI SDK** | Streaming AI responses |
| **LlamaIndex** | RAG pipelines |
| **Instructor** | Structured LLM outputs |

## Using Shared Packages

Import from workspace packages:
```typescript
import { someUtility } from '@squared-agent/core';
```
