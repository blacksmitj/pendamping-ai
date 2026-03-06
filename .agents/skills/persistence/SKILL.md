---
name: persistence
description: Prisma singleton and isolation patterns.
---

# Persistence Skill

## Client
- **Location**: `src/lib/prisma.ts` (Singleton).
- **Isolation**: Always include `universityId` or `userId` in `where` clauses.

## Patterns
- **Transactions**: `prisma.$transaction([...])`.
- **Performance**: Use `createMany` for bulk imports.
