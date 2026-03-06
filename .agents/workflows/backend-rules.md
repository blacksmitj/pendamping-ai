---
description: Core rules for backend, Prisma, and Server Actions.
---

# Backend Rules (Optimized)

## 1. Safety First
- **Auth**: Always verify session (`auth.api.getSession()`) at the start of Server Actions.
- **Isolation**: Every Prisma query **MUST** include tenancy/isolation (`where: { universityId: ... }`).

## 2. Best Practices
- **Transactions**: Use `prisma.$transaction` for multi-step mutations.
- **Revalidation**: Call `revalidatePath` after data changes.
- **No Hallucinations**: Verify Prisma/Better Auth signatures against existing code or Context7 if unknown.

## 3. Skills
- New backend patterns from Context7 **MUST** be added to `.agents/skills/`.
