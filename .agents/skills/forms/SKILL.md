---
name: forms
description: React Hook Form + Zod patterns.
---

# Forms Skill

## Integration
1. **Schema**: Define Zod schema and infer `FormValues`.
2. **Hook**: Initialize `useForm<FormValues>`.
3. **Submit**: Use `SubmitHandler<FormValues>`.

## Helpers
- For optional fields, use `.optional().or(z.literal(""))`.
- Ensure all inputs have unique IDs matching the field name.
