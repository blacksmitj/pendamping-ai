---
name: auth
description: Better Auth implementation patterns.
---

# Auth Skill

## Setup
- **Config**: `src/lib/auth.ts`.
- **API**: `src/app/api/auth/[...all]/route.ts`.
- **Roles**: `MENTOR`, `UNIVERSITY_ADMIN`, `UNIVERSITY_SUPERVISOR`, `SUPER_ADMIN`.

## Usage
- **Server**: `auth.api.getSession({ headers: await headers() })`.
- **Client**: `useSession()` hook.
