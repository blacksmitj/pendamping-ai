---
name: data-fetching
description: TanStack Query and query keys.
---

# Data Fetching Skill

## TanStack Query
- **Provider**: `src/components/providers/query-provider.tsx`.
- **Keys**: `src/lib/query-keys.ts` (Factory).
- **Settings**: `staleTime: 1min`, `gcTime: 5min`.

## Usage
- Use `useQuery` for fetching.
- Use `useMutation` for actions.
- Call `revalidatePath` in Server Actions to sync server cache.
