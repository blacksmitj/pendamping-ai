---
description: Core rules for frontend, Tanstack Query, and UI components.
---

# Frontend Rules (Optimized)

## 1. Data Fetching
- **TanStack Query**: Mandatory for all client-side data. Use `useQuery` and `useMutation`.
- **Query Keys**: Import factory from `src/lib/query-keys.ts`.
- **Server Actions**: Do not call directly in `useEffect`. Wrap in `useMutation`.

## 2. UI Components (shadcn/ui)
- **Overlay**: **ALWAYS** use `Sheet` (right side) instead of `Dialog`.
- **Preview**: PDF/Image previews must use `Sheet`.
- **Accessibility**: Include close buttons and use `asChild` for semantic links.

## 3. Form Pattern
- Use the **Field Pattern** (`src/components/ui/field.tsx`) with `react-hook-form`.
