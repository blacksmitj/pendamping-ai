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
- **Form Pattern**: Preference for the `Field` pattern over the older `Form` components. Use `src/components/ui/field.tsx` components.

### 📝 Form Implementation (Field Pattern)

The project uses a modern "Field" pattern for forms, integrating `react-hook-form` with custom `Field` components.

**Key Components**:
- `Field`: The main wrapper for a form field.
- `FieldLabel`: The label for the field.
- `FieldControl`: (Implicitly handled by `react-hook-form`'s `Controller` or direct input).
- `FieldDescription`: Optional helper text.
- `FieldError`: Displays validation errors.

**Example Usage**:
```tsx
import { useForm, Controller } from "react-hook-form"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// Inside component
<Controller
    control={form.control}
    name="username"
    render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Username</FieldLabel>
            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
            <FieldError errors={[fieldState.error]} />
        </Field>
    )}
/>
```

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
    
## 📊 Excel Data Import (SheetJS)

- **Library**: `xlsx` (SheetJS)
- **Implementation Pattern**:
  - **Client-side**: Use `xlsx` to parse the file into a JSON array to provide feedback and partial validation before sending to the server.
  - **Server-side**: Use `prisma.model.createMany({ data: [...], skipDuplicates: true })` for optimal performance with large datasets (10,000+ rows).
- **Mapping**: Create a clear mapping between Excel headers and Prisma fields to ensure data integrity.
- **Components**: Use `ImportDialog` for a consistent import experience across different modules.

## 📝 React Hook Form Patterns

To ensure strict type safety and avoid common TypeScript errors with `useForm` and `zodResolver`:

1.  **Define Schema & Types**:
    ```typescript
    const schema = z.object({
        name: z.string().min(1, "Required"),
        email: z.string().email().optional().or(z.literal("")),
    })
    type FormValues = z.infer<typeof schema>
    ```

2.  **Initialize `useForm` with Generics**:
    Always provide the inferred type to `useForm` to ensure `defaultValues` and `onSubmit` are strictly typed.
    ```typescript
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { ... }
    })
    ```

3.  **Strict Submit Handler**:
    Explicitly type the `onSubmit` function to match `SubmitHandler<FormValues>`.
    ```typescript
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        // data is strictly FormValues
    }
    ```

4.  **Handling Optionals**:
    For optional fields that are represented as empty strings in HTML inputs, use `.optional().or(z.literal(""))` or `.default("")` in Zod to avoid `undefined` vs `string` type mismatches.

