---
name: Database Management
description: Mandatory use of Prisma-Local for database tasks.
---

# Database Management Standards (Prisma)

All database-related tasks, including migrations, schema updates, and data viewing, **MUST** be handled through the `Prisma-Local` MCP server.

## Procedures
1. Migrations: Use `mcp_Prisma-Local_migrate-dev` for schema changes.
2. Data View: Use `mcp_Prisma-Local_Prisma-Studio` to view and edit data visually.
3. Status: Use `mcp_Prisma-Local_migrate-status` to check migration state.

## Prisma Client Usage
All application code **MUST** use the centralized Prisma instance. Do not instantiate `PrismaClient` directly in multiple files.

- **Centralized Instance**: [prisma.ts](file:///c:/react/pendamping-ai/src/lib/prisma.ts)
- **Import Statement**:
  ```typescript
  import prisma from "@/lib/prisma";
  ```
- **Example Usage**:
  ```typescript
  const users = await prisma.user.findMany();
  ```
