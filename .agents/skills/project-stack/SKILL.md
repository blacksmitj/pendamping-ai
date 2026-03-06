---
name: project-stack
description: Core technology stack and implementation patterns for the Pendamping AI project.
---

# Project Stack Skill

This skill documents the specific implementation patterns and best practices for the Pendamping AI project, covering authentication, data access, UI components, and state management.

## 🔑 Authentication (Better Auth)

- **Location**: `src/lib/auth.ts`
- **Configuration**: Uses the Prisma adapter with a singleton `PrismaClient`.
- **Custom Fields**:
  - `role`: (MENTOR, UNIVERSITY_ADMIN, UNIVERSITY_SUPERVISOR, SUPER_ADMIN)
  - `status`: (PENDING, APPROVED, REJECTED, SUSPENDED)
  - `universityId`: ID of the university the user belongs to.
- **Next.js Handler**: `src/app/api/auth/[...all]/route.ts` mounts the Better Auth handlers.
- **Usage**:
  - Use `auth.api.getSession({ headers: await headers() })` in Server Actions.
  - Use `useSession()` hooks on the client side.

## 🗄️ Data Access (Prisma)

- **Location**: `src/lib/prisma.ts`
- **Pattern**: Singleton instance to avoid "Too many clients" errors in development.
- **Provider**: PostgreSQL.
- **Best Practices**:
  - Use `prisma.$transaction` for multi-step mutations (e.g., reviews).
  - Always enforce data isolation by including `universityId` or `userId` in `where` clauses.

## 🎨 UI Components (shadcn/ui)

- **Location**: `src/components/ui`
- **Style**: Accessible components built with Radix UI and Tailwind CSS.
- **Customization**: Components should be modified directly in the `ui` folder if needed for project-specific styling.
- **Standard**: Use `asChild` for semantic HTML (e.g., when a `Button` is also a `Link`).

## 🔄 State Management (TanStack Query)

- **Provider**: `src/components/providers/query-provider.tsx`
- **Query Keys**: `src/lib/query-keys.ts` defines a centralized, type-safe query key factory.
- **Configuration**:
  - `staleTime`: 1 minute.
  - `gcTime`: 5 minutes.
  - `refetchOnWindowFocus`: False.
- **Best Practices**:
  - Use the centralized `queryKeys` factory for all queries and mutations.
  - Perform on-demand revalidation in Server Actions using `revalidatePath`.

## ⚙️ Server Actions

- **Location**: `src/actions/`
- **Security**:
  - Always verify session and roles at the start of the action.
  - Return clearly defined objects or throw errors for unauthorized access.
- **Revalidation**: Use `revalidatePath` after every mutation to keep the server cache fresh.
