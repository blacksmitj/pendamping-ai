---
name: ui-patterns
description: shadcn/ui and Field pattern.
---

# UI Patterns Skill

## Components
- **Location**: `src/components/ui`.
- **Standard**: Use `asChild` for semantic elements.
- **Overlay**: Use `Sheet` (right) instead of `Dialog`.

## Field Pattern
- **Wrapper**: `Field` (from `src/components/ui/field.tsx`).
- **Elements**: `FieldLabel`, `FieldError`, `FieldDescription`.
- **Logic**: Integrate via `Controller` from `react-hook-form`.
