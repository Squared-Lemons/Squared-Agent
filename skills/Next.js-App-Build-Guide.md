# Next.js App Build Guide

A comprehensive guide for building Next.js applications with Better Auth, Drizzle ORM, and Turborepo monorepo structure. Based on lessons learned from the gym-management project.

---

## Table of Contents

1. [Monorepo Setup](#1-monorepo-setup)
2. [Database with Drizzle ORM](#2-database-with-drizzle-orm)
3. [Authentication with Better Auth](#3-authentication-with-better-auth)
4. [Environment Variables](#4-environment-variables)
5. [UI Components](#5-ui-components)
6. [Server Actions](#6-server-actions)
7. [Route Protection & Onboarding](#7-route-protection--onboarding)
8. [Common Pitfalls](#8-common-pitfalls)
9. [Database Reset Workflow](#9-database-reset-workflow)
10. [Project Checklist](#10-project-checklist)

---

## 1. Monorepo Setup

### Structure

```
project/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/                # App Router
│       ├── components/         # App-specific components
│       ├── lib/                # Utilities, actions
│       └── package.json
├── packages/
│   ├── database/               # Drizzle ORM schema & client
│   ├── auth/                   # Better Auth configuration
│   ├── ui/                     # Shared UI components (shadcn)
│   └── config/                 # Shared configs (typescript, tailwind)
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

### Root package.json

```json
{
  "name": "my-app",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "db:generate": "turbo db:generate",
    "db:migrate": "turbo db:migrate",
    "db:push": "turbo db:push",
    "db:studio": "pnpm --filter @app/database db:studio",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "typescript": "^5.7.2"
  },
  "packageManager": "pnpm@9.15.0"
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    }
  }
}
```

---

## 2. Database with Drizzle ORM

### Package Setup (packages/database)

```json
{
  "name": "@app/database",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema/index.ts"
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "better-sqlite3": "^11.7.0",
    "drizzle-orm": "^0.38.3"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.12",
    "drizzle-kit": "^0.30.1",
    "tsup": "^8.3.5"
  }
}
```

### drizzle.config.ts

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./data/app.db",
  },
});
```

### Database Client (src/index.ts)

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database(
  process.env.DATABASE_URL?.replace("file:", "") || "./data/app.db"
);

export const db = drizzle(sqlite, { schema });
export * from "./schema";
```

### Schema Exports (src/schema/index.ts)

```typescript
// Auth tables - MUST use singular names for Better Auth
export * from "./auth";

// Organization tables - MUST use singular names for Better Auth org plugin
export * from "./organizations";

// Application tables
export * from "./gyms";
export * from "./members";
// ... etc
```

---

## 3. Authentication with Better Auth

### Critical Requirements

> **IMPORTANT**: Better Auth expects **singular** table names. This is non-negotiable.

| Expected Table | NOT This |
|---------------|----------|
| `user` | `users` |
| `session` | `sessions` |
| `account` | `accounts` |
| `verification` | `verifications` |
| `organization` | `organizations` |
| `member` | `organization_members` |

### Auth Schema (packages/database/src/schema/auth.ts)

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// SINGULAR table names required by Better Auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
});
```

### Organization Schema (packages/database/src/schema/organizations.ts)

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// SINGULAR table name required by Better Auth organization plugin
export const organization = sqliteTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// SINGULAR table name - "member" not "members" or "organization_members"
export const member = sqliteTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  role: text("role", { enum: ["owner", "admin", "member"] })
    .notNull()
    .default("member"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
}));
```

### Auth Package (packages/auth/src/index.ts)

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "@app/database";
import * as schema from "@app/database/schema";

export const auth = betterAuth({
  // REQUIRED: baseURL is needed for OAuth callbacks
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // REQUIRED: Pass schema to adapter for table recognition
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,  // <-- Don't forget this!
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      // REQUIRED: Map to your schema's model names
      schema: {
        organization: {
          modelName: "organization",
        },
        member: {
          modelName: "member",
        },
      },
    }),
  ],

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
```

### Auth Client (packages/auth/src/client.ts)

```typescript
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  useActiveOrganization,
  organization,
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [organizationClient()],
});
```

---

## 4. Environment Variables

### Critical Path Issue

> **IMPORTANT**: Next.js only loads `.env` from its own directory, not the monorepo root.

### Solution Options

**Option 1: Symlink (Recommended)**
```bash
# From apps/web directory
ln -s ../../.env .env
```

**Option 2: Copy .env to apps/web**
```bash
cp .env apps/web/.env
```

### DATABASE_URL Path Resolution

> **IMPORTANT**: Relative paths in DATABASE_URL resolve from where the app runs (apps/web), not where the .env file is.

```env
# WRONG - resolves to apps/web/packages/database/data/app.db
DATABASE_URL=file:./packages/database/data/app.db

# CORRECT - resolves to packages/database/data/app.db
DATABASE_URL=file:../../packages/database/data/app.db
```

### Example .env File

```env
# Database (path relative to apps/web)
DATABASE_URL=file:../../packages/database/data/app.db

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Navigate to "APIs & Services" > "Credentials"
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to .env

---

## 5. UI Components

### shadcn/ui in Monorepo (packages/ui)

```json
{
  "name": "@app/ui",
  "version": "0.0.1",
  "exports": {
    ".": "./src/index.ts",
    "./globals.css": "./src/globals.css"
  },
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.469.0",
    "tailwind-merge": "^2.6.0"
  }
}
```

### Re-export Pattern (packages/ui/src/index.ts)

```typescript
// Utilities
export { cn } from "./lib/utils";

// Components
export { Button, buttonVariants } from "./components/button";
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/card";
export { Input } from "./components/input";
export { Label } from "./components/label";
// ... etc
```

---

## 6. Server Actions

### Pattern for Form Handling (apps/web/lib/actions/gyms.ts)

```typescript
"use server";

import { db } from "@app/database";
import { gyms } from "@app/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@app/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

export async function createGym(data: {
  name: string;
  address?: string;
  city?: string;
  postcode?: string;
  phone?: string;
  email?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Get active organization
  const activeOrg = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!activeOrg) {
    throw new Error("No active organization");
  }

  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  await db.insert(gyms).values({
    id: nanoid(),
    organizationId: activeOrg.id,
    name: data.name,
    slug,
    address: data.address || null,
    city: data.city || null,
    postcode: data.postcode || null,
    phone: data.phone || null,
    email: data.email || null,
  });

  revalidatePath("/gyms");
}

export async function updateGym(
  id: string,
  data: Partial<{
    name: string;
    address: string;
    city: string;
    postcode: string;
    phone: string;
    email: string;
  }>
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db
    .update(gyms)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(gyms.id, id));

  revalidatePath("/gyms");
}

export async function deleteGym(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db.delete(gyms).where(eq(gyms.id, id));
  revalidatePath("/gyms");
}
```

---

## 7. Route Protection & Onboarding

### Onboarding Check Component

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useActiveOrganization } from "@app/auth/client";
import { Loader2 } from "lucide-react";
import { checkOnboardingStatus } from "@/lib/actions/onboarding";

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: activeOrg, isPending: orgPending } = useActiveOrganization();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      if (sessionPending || orgPending) return;

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const status = await checkOnboardingStatus();

      if (!status.hasOrganization || !status.hasGym) {
        router.push("/onboarding");
        return;
      }

      setChecking(false);
    }

    check();
  }, [session, activeOrg, sessionPending, orgPending, router]);

  if (sessionPending || orgPending || checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
```

### Dashboard Layout with Protection

```typescript
// apps/web/app/(dashboard)/layout.tsx
import { OnboardingCheck } from "@/components/onboarding-check";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingCheck>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </OnboardingCheck>
  );
}
```

---

## 8. Common Pitfalls

### Better Auth

| Issue | Cause | Solution |
|-------|-------|----------|
| OAuth button does nothing | Missing `baseURL` | Add `baseURL` to betterAuth() config |
| "model not found" error | Plural table names | Use singular: `user`, `session`, `account`, `verification` |
| "model not found" for org | Wrong table names | Use `organization` and `member` (singular) |
| Schema not recognized | Schema not passed | Add `schema` to drizzleAdapter options |

### Drizzle ORM

| Issue | Cause | Solution |
|-------|-------|----------|
| Migration prompts | Renaming tables | Delete db + drizzle folder, regenerate fresh |
| Table not found | Schema export missing | Check src/schema/index.ts exports |

### Next.js Monorepo

| Issue | Cause | Solution |
|-------|-------|----------|
| Env vars undefined | Wrong .env location | Symlink or copy .env to apps/web |
| Database not found | Wrong relative path | Use `../../packages/...` from apps/web |
| Package not found | Missing workspace dep | Add `@app/package: workspace:*` to package.json |

### React

| Issue | Cause | Solution |
|-------|-------|----------|
| Fragment key warning | Key on shorthand `<>` | Use `<Fragment key={...}>` with import |

---

## 9. Database Reset Workflow

When you need a completely fresh database:

```bash
# 1. Remove existing database and migrations
rm packages/database/data/app.db
rm -rf packages/database/drizzle/*

# 2. Generate fresh migrations (no rename prompts)
pnpm db:generate

# 3. Apply migrations
pnpm db:migrate

# 4. Start dev server
pnpm dev
```

---

## 10. Project Checklist

### Initial Setup

- [ ] Create monorepo structure (apps/, packages/)
- [ ] Configure pnpm-workspace.yaml
- [ ] Configure turbo.json
- [ ] Set up packages/database with Drizzle
- [ ] Set up packages/auth with Better Auth
- [ ] Set up packages/ui with shadcn
- [ ] Set up apps/web with Next.js

### Database Schema

- [ ] Create auth tables with **singular** names (user, session, account, verification)
- [ ] Create organization tables with **singular** names (organization, member)
- [ ] Export all schemas from packages/database/src/schema/index.ts
- [ ] Run db:generate and db:migrate

### Authentication

- [ ] Add `baseURL` to betterAuth() config
- [ ] Pass `schema` to drizzleAdapter
- [ ] Configure organization plugin with schema mapping
- [ ] Set up auth client with organizationClient plugin
- [ ] Create API route at apps/web/app/api/auth/[...all]/route.ts

### Environment

- [ ] Create .env in monorepo root
- [ ] Symlink .env to apps/web/.env
- [ ] Use correct relative path for DATABASE_URL
- [ ] Set up Google OAuth credentials

### Application

- [ ] Create onboarding flow
- [ ] Add OnboardingCheck component
- [ ] Wrap dashboard layout with OnboardingCheck
- [ ] Create server actions for CRUD operations
- [ ] Set up sidebar navigation
- [ ] Set up header with user menu

---

## Quick Reference

### Package Dependencies

```bash
# Database package
pnpm add better-sqlite3 drizzle-orm
pnpm add -D @types/better-sqlite3 drizzle-kit tsup

# Auth package
pnpm add better-auth

# UI package
pnpm add @radix-ui/react-* class-variance-authority clsx lucide-react tailwind-merge

# Web app
pnpm add @app/database @app/auth @app/ui nanoid
```

### Key File Locations

```
packages/database/src/schema/auth.ts      # Auth tables (singular names!)
packages/database/src/schema/index.ts     # Schema exports
packages/auth/src/index.ts                # Better Auth server config
packages/auth/src/client.ts               # Better Auth client
apps/web/app/api/auth/[...all]/route.ts   # Auth API route
apps/web/lib/actions/*.ts                 # Server actions
apps/web/components/onboarding-check.tsx  # Route protection
```

---

*Last updated: 2026-01-12*
