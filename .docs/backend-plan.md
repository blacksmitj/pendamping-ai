# Backend Plan — Pendamping AI

> **Version:** 2.0
> **Date:** 2026-03-05
> **Stack:** Next.js 16 App Router · Prisma 7 (PostgreSQL via Prisma Accelerate) · Better Auth · TanStack Query v5

---

## 1. Overview

This document outlines the full backend integration plan to connect the existing frontend (currently using mock data) to a real PostgreSQL backend. The backend is built within Next.js App Router using **Server Actions** and **API Route Handlers**, with **Prisma 7** as ORM, **Better Auth** for authentication, and **TanStack Query v5** for client-side data management.

### Application Flow (from plan.md)

```
1. Super Admin creates a Workspace (event) → e.g. TKML 2025
2. Super Admin uploads Excel → all Participants enter the workspace
3. Super Admin registers Universities
4. Admin & Pengawas register → select their university
5. Super Admin approves Admin / Pengawas
6. Super Admin bulk assigns Participants → to Universities
7. Pendamping registers → selects university
8. Admin approves Pendamping
9. Admin multi-assigns Participants → to Pendamping
10. Pendamping logs in → sees assigned participants
11. Pendamping fills daily Logbook & monthly Capaian Output
12. Admin reviews (approve/revise/reject) Logbook & Capaian Output
13. Pengawas monitors & adds notes
```

---

## 2. Prisma Schema (Complete)

All field names, model names, and enum values are in English.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ========================
// BETTER AUTH CORE TABLES
// ========================
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  role          UserRole  @default(PENDAMPING)
  status        UserStatus @default(PENDING)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // === Relations ===
  universityId  String?
  university    University? @relation(fields: [universityId], references: [id])
  workspaces    UserWorkspace[]
  logbooks      Logbook[]
  assignments   ParticipantAssignment[]
  logbookReviews   LogbookReview[]
  outputReviews    OutputReview[]
  supervisorNotes  SupervisorNote[]

  // Better Auth managed
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  activeWorkspaceId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                    String  @id @default(cuid())
  accountId             String
  providerId            String
  userId                String
  user                  User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// ========================
// ENUMS
// ========================
enum UserRole {
  PENDAMPING
  ADMIN_UNIV
  PENGAWAS_UNIV
  SUPER_ADMIN
}

enum UserStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum WorkspaceStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}

enum DeliveryMethod {
  FACE_TO_FACE
  ONLINE
}

enum MeetingType {
  INDIVIDUAL
  GROUP
}

enum ReviewStatus {
  DRAFT
  SUBMITTED
  REVISION
  APPROVED
  REJECTED
}

// ========================
// WORKSPACE (Multi-Event)
// ========================
model Workspace {
  id          String          @id @default(cuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  status      WorkspaceStatus @default(ACTIVE)
  description String?

  universities  University[]
  participants  Participant[]
  users         UserWorkspace[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model UserWorkspace {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([userId, workspaceId])
}

// ========================
// UNIVERSITY
// ========================
model University {
  id       String  @id @default(cuid())
  name     String
  code     String  @unique
  address  String?
  city     String?
  province String?

  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  users        User[]
  participants Participant[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ========================
// PARTICIPANT
// ========================
model Participant {
  id      String @id @default(cuid())
  idTkm   String @unique

  // --- Imported from Excel ---
  // Personal Info
  fullName          String
  registrantNik     String?
  birthPlace        String?
  lastEducation     String?
  currentActivity   String?
  isDisabled        Boolean  @default(false)
  disabilityType    String?
  registrationDate  DateTime?

  // Contact
  whatsapp          String?
  socialPlatform    String?
  socialAccount     String?
  socialLink        String?

  // Emergency Contact
  relativeName1     String?
  relativePhone1    String?
  relativeStatus1   String?
  relativeName2     String?
  relativePhone2    String?
  relativeStatus2   String?

  // Business Profile
  businessName      String?
  businessSector    String?
  businessType      String?
  businessDesc      String?
  mainProduct       String?
  businessLocation  String?
  locationOwnership String?
  sameAsResidence   Boolean? @default(false)
  businessAddress   String?
  businessProvince  String?
  businessCity      String?
  businessDistrict  String?
  businessSubDistrict String?
  businessPostalCode  String?
  salesChannel      String?
  marketingArea     String?
  marketingCountry  String?
  businessPartner   String?
  partnerCount      Int?
  revenuePerPeriod  Decimal?
  profitPerPeriod   Decimal?
  productCountPerPeriod Float?
  productUnitPerPeriod  String?

  // Uploaded Documents (URLs from file storage)
  ktpUrl                String?
  familyCardUrl         String?
  selfPhotoUrl          String?
  assistanceLetterUrl   String?
  commitmentLetterUrl   String?
  businessProfileDocUrl String?
  bmcStrategyDocUrl     String?
  rabDocUrl             String?
  developmentPlanUrl    String?
  businessVideoUrl      String?
  businessPhotoUrl      String?
  financialRecordUrl    String?

  // --- Filled by Pendamping ---
  communicationStatus    String?
  fundDisbursementStatus String?
  presenceStatus         String?
  isWillingToBeAssisted  Boolean?
  unwillingReason        String?
  status                 String   @default("active") // active / drop
  dropReason             String?
  googleMapsUrl          String?
  bmcUrl                 String?
  actionPlanUrl          String?

  // === Relations ===
  workspaceId   String
  workspace     Workspace   @relation(fields: [workspaceId], references: [id])
  universityId  String?
  university    University? @relation(fields: [universityId], references: [id])
  assignments   ParticipantAssignment[]
  logbookParticipants LogbookParticipant[]
  outputs       Output[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ParticipantAssignment {
  id            String      @id @default(cuid())
  participantId String
  participant   Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)
  pendampingId  String
  pendamping    User        @relation(fields: [pendampingId], references: [id], onDelete: Cascade)

  assignedAt    DateTime    @default(now())

  @@unique([participantId, pendampingId])
}

// ========================
// LOGBOOK
// ========================
model Logbook {
  id                String         @id @default(cuid())
  date              DateTime
  deliveryMethod    DeliveryMethod
  meetingType       MeetingType
  visitType         String
  startTime         DateTime
  endTime           DateTime
  jpl               Int            @default(0)
  material          String
  summary           String
  obstacle          String
  solution          String
  totalExpense      Decimal        @default(0)
  documentationUrls String[]
  expenseProofUrl   String?
  noExpenseReason   String?
  reviewStatus      ReviewStatus   @default(DRAFT)

  pendampingId String
  pendamping   User   @relation(fields: [pendampingId], references: [id])
  logbookParticipants LogbookParticipant[]
  reviews      LogbookReview[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model LogbookParticipant {
  id            String      @id @default(cuid())
  logbookId     String
  logbook       Logbook     @relation(fields: [logbookId], references: [id], onDelete: Cascade)
  participantId String
  participant   Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)

  @@unique([logbookId, participantId])
}

model LogbookReview {
  id         String       @id @default(cuid())
  logbookId  String
  logbook    Logbook      @relation(fields: [logbookId], references: [id], onDelete: Cascade)
  reviewerId String
  reviewer   User         @relation(fields: [reviewerId], references: [id])
  action     ReviewStatus
  note       String?

  createdAt  DateTime     @default(now())
}

// ========================
// OUTPUT (Capaian Output)
// ========================
model Output {
  id                           String       @id @default(cuid())
  participantId                String
  participant                  Participant  @relation(fields: [participantId], references: [id])
  reportMonth                  DateTime
  revenue                      Decimal
  salesVolume                  Float
  salesVolumeUnit              String
  productionCapacity           Float
  productionCapacityUnit       String
  workerConfirmation           String
  incomeProofUrl               String
  cashflowProofUrl             String
  obstacle                     String
  marketingArea                String
  businessCondition            String
  lpjUrl                       String
  hasCashflowBookkeeping       Boolean
  hasIncomeStatementBookkeeping Boolean
  reviewStatus                 ReviewStatus @default(DRAFT)

  employees Employee[]
  reviews   OutputReview[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Employee {
  id               String @id @default(cuid())
  outputId         String
  output           Output @relation(fields: [outputId], references: [id], onDelete: Cascade)
  nik              String
  name             String
  ktpUrl           String
  employmentStatus String
  hasBpjs          Boolean
  isDisabled       Boolean
  disabilityType   String?
  gender           String
  bpjsType         String?
  bpjsNumber       String?
  bpjsCardUrl      String?
  role             String
  salarySlipUrl    String
}

model OutputReview {
  id         String       @id @default(cuid())
  outputId   String
  output     Output       @relation(fields: [outputId], references: [id], onDelete: Cascade)
  reviewerId String
  reviewer   User         @relation(fields: [reviewerId], references: [id])
  action     ReviewStatus
  note       String?

  createdAt  DateTime     @default(now())
}

// ========================
// SUPERVISOR NOTES
// ========================
model SupervisorNote {
  id           String @id @default(cuid())
  supervisorId String
  supervisor   User   @relation(fields: [supervisorId], references: [id])
  targetType   String // "LOGBOOK" | "OUTPUT"
  targetId     String
  message      String

  createdAt DateTime @default(now())
}
```

---

## 3. Authentication — Better Auth

### Strategy

| Item | Choice |
|---|---|
| Library | **Better Auth** |
| Provider | **Email & Password** (credentials) |
| DB Adapter | **Prisma** (`better-auth/adapters/prisma`) |
| Session | **Database sessions** (managed by Better Auth) |
| Route Protection | **Next.js `proxy.ts`** (replaces `middleware.ts` in Next.js 16) |
| Session Data | `id`, `email`, `name`, `role`, `status`, `universityId`, `activeWorkspaceId` |

### Server-Side Setup

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    // Custom session fields from User
    additionalFields: {
      role: { type: "string" },
      status: { type: "string" },
      universityId: { type: "string", nullable: true },
    },
  },
});
```

### API Route Handler

```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### Client-Side Auth

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

### Route Protection — `proxy.ts`

Next.js 16 introduces `proxy.ts` at the project root (replaces `middleware.ts`). This intercepts all requests before they reach the route handler.

```typescript
// proxy.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/participants/:path*",
    "/logbooks/:path*",
    "/outputs/:path*",
    "/admin/:path*",
    "/supervisor/:path*",
    "/super/:path*",
    "/settings/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (sessionCookie && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  const protectedPrefixes = [
    "/dashboard", "/participants", "/logbooks", "/outputs",
    "/admin", "/supervisor", "/super", "/settings", "/account",
  ];
  if (!sessionCookie && protectedPrefixes.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

### Server-Side Session Check

```typescript
// Usage in any Server Component or API Route
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) redirect("/login");
if (session.user.status !== "APPROVED") redirect("/pending");
```

### Auth Flow

```
Login:
1. User submits email + password at /login
2. authClient.signIn.email({ email, password })
3. Better Auth verifies credentials → creates session
4. Check user.status === APPROVED (redirect to /pending if not)
5. Redirect to /dashboard

Register:
1. User submits form at /register (name, email, password, role, university)
2. authClient.signUp.email({ name, email, password })
3. Server Action → set role, universityId, status: PENDING
4. Redirect to /pending ("Waiting for Approval" page)
5. Admin/Super Admin approves user → status: APPROVED
```

---

## 4. Data Management — TanStack Query v5

### Setup

```typescript
// src/components/providers/query-provider.tsx
"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,        // 1 minute
        gcTime: 5 * 60 * 1000,       // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Query Key Convention

```typescript
// src/lib/query-keys.ts
export const queryKeys = {
  // Workspaces
  workspaces: {
    all: ["workspaces"] as const,
    detail: (id: string) => ["workspaces", id] as const,
  },
  // Universities
  universities: {
    all: ["universities"] as const,
    detail: (id: string) => ["universities", id] as const,
  },
  // Users
  users: {
    all: ["users"] as const,
    byRole: (role: string) => ["users", { role }] as const,
  },
  // Participants
  participants: {
    all: ["participants"] as const,
    detail: (id: string) => ["participants", id] as const,
    list: (filters: Record<string, unknown>) => ["participants", filters] as const,
  },
  // Logbooks
  logbooks: {
    all: ["logbooks"] as const,
    detail: (id: string) => ["logbooks", id] as const,
    list: (filters: Record<string, unknown>) => ["logbooks", filters] as const,
  },
  // Outputs
  outputs: {
    all: ["outputs"] as const,
    detail: (id: string) => ["outputs", id] as const,
    list: (filters: Record<string, unknown>) => ["outputs", filters] as const,
  },
  // Dashboard
  dashboard: {
    stats: ["dashboard", "stats"] as const,
    recentLogbooks: ["dashboard", "recent-logbooks"] as const,
    charts: ["dashboard", "charts"] as const,
  },
} as const;
```

### Usage Pattern

```typescript
// Example: List participants page
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

// Fetch function
async function fetchParticipants(filters: Record<string, unknown>) {
  const params = new URLSearchParams(filters as Record<string, string>);
  const res = await fetch(`/api/participants?${params}`);
  if (!res.ok) throw new Error("Failed to fetch participants");
  return res.json();
}

// In component
const { data, isPending, error } = useQuery({
  queryKey: queryKeys.participants.list({ page: 1, sector: "all" }),
  queryFn: () => fetchParticipants({ page: "1", sector: "all" }),
});

// Mutation example
const queryClient = useQueryClient();
const toggleStatus = useMutation({
  mutationFn: (id: string) => toggleParticipantStatus(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.participants.all });
  },
});
```

---

## 5. API Routes & Server Actions

### Conventions

- **Server Actions** (`"use server"`) → for data mutations (create, update, delete)
- **Route Handlers** (`route.ts`) → for GET requests with pagination/filtering
- Location: `src/app/api/` for route handlers, `src/actions/` for server actions
- All routes and field names in **English**

### 5.1 Auth

| Method | Endpoint / Action | Description |
|---|---|---|
| GET/POST | `api/auth/[...all]` | Better Auth handler |
| Action | `actions/auth/register` | Register new user (set role + university) |

### 5.2 Workspaces (Super Admin)

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/workspaces` | List all workspaces |
| Action | `actions/workspaces/create` | Create workspace |
| Action | `actions/workspaces/update` | Update workspace |
| Action | `actions/workspaces/set-active` | Set active workspace (session) |

### 5.3 Universities

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/universities` | List universities (by workspace) |
| Action | `actions/universities/create` | Create university |
| Action | `actions/universities/update` | Update university |
| Action | `actions/universities/delete` | Delete university |

### 5.4 Users

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/users` | List users (filter by role, status, university) |
| Action | `actions/users/approve` | Approve user |
| Action | `actions/users/reject` | Reject user |
| Action | `actions/users/suspend` | Suspend user |

### 5.5 Participants

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/participants` | List participants (pagination, filter) |
| GET | `api/participants/[id]` | Participant detail |
| Action | `actions/participants/import-excel` | Import from Excel |
| Action | `actions/participants/update` | Update participant data |
| Action | `actions/participants/toggle-status` | Activate/drop participant |

### 5.6 Assignments

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/assignments` | List current assignments |
| Action | `actions/assignments/bulk-to-university` | Super Admin → assign to universities |
| Action | `actions/assignments/to-pendamping` | Admin → assign to pendamping |
| Action | `actions/assignments/remove` | Remove assignment |

### 5.7 Logbooks

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/logbooks` | List logbooks (per pendamping / university) |
| GET | `api/logbooks/[id]` | Logbook detail |
| Action | `actions/logbooks/create` | Create logbook |
| Action | `actions/logbooks/update` | Update logbook |
| Action | `actions/logbooks/delete` | Delete logbook |
| Action | `actions/logbooks/submit` | Submit for review |
| Action | `actions/logbooks/review` | Admin: approve/revise/reject |

### 5.8 Outputs (Capaian Output)

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/outputs` | List outputs |
| GET | `api/outputs/[id]` | Output detail |
| Action | `actions/outputs/create` | Create output |
| Action | `actions/outputs/update` | Update output |
| Action | `actions/outputs/delete` | Delete output |
| Action | `actions/outputs/submit` | Submit for review |
| Action | `actions/outputs/review` | Admin: approve/revise/reject |

### 5.9 Dashboard

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/dashboard/stats` | Stats (role-aware, per workspace) |
| GET | `api/dashboard/recent-logbooks` | Recent logbook entries |
| GET | `api/dashboard/charts` | Chart data overview |

### 5.10 Supervisor (Pengawas)

| Method | Endpoint / Action | Description |
|---|---|---|
| GET | `api/supervisor/universities` | List monitored universities |
| GET | `api/supervisor/universities/[id]` | University detail |
| GET | `api/supervisor/logbooks` | Monitor logbooks |
| GET | `api/supervisor/outputs` | Monitor outputs |
| Action | `actions/supervisor/add-note` | Add supervisor note |

---

## 6. File Upload — MinIO (Localhost)

| Item | Choice |
|---|---|
| Storage | **MinIO** (localhost, Docker) |
| S3 API Port | `9002` (mapped from container `9000`) |
| Console Port | `9003` (mapped from container `9001`) |
| Bucket | `pendamping-ai` |
| Upload Method | Presigned URL (client → direct to MinIO) |
| Database | Store URL path as `String` field |

```yaml
# docker-compose.yml (reference)
minio:
  image: minio/minio:latest
  container_name: infra_minio
  restart: unless-stopped
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: change_me_strong
    TZ: Asia/Jakarta
  command: server /data --console-address ":9001"
  ports:
    - "9002:9000"  # S3 API
    - "9003:9001"  # Console
  volumes:
    - infra_minio_data:/data
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `api/uploads/presigned-url` | Generate presigned URL for upload |
| DELETE | `api/uploads/[key]` | Delete file from MinIO |

---

## 7. New Dependencies

```bash
# Auth
npm install better-auth

# Data management
npm install @tanstack/react-query @tanstack/react-query-devtools

# Excel import
npm install xlsx

# File upload (optional, depends on storage choice)
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

## 8. New Folder Structure

```
pendamping-ai/
├── proxy.ts                       # Route protection (replaces middleware.ts)
├── prisma/
│   └── schema.prisma              # Full schema
│   └── seed.ts                    # Seed Super Admin user
├── src/
│   ├── actions/                   # Server Actions (mutations)
│   │   ├── auth/
│   │   │   └── register.ts
│   │   ├── workspaces/
│   │   │   ├── create.ts
│   │   │   └── update.ts
│   │   ├── universities/
│   │   │   ├── create.ts
│   │   │   ├── update.ts
│   │   │   └── delete.ts
│   │   ├── users/
│   │   │   ├── approve.ts
│   │   │   ├── reject.ts
│   │   │   └── suspend.ts
│   │   ├── participants/
│   │   │   ├── import-excel.ts
│   │   │   ├── update.ts
│   │   │   └── toggle-status.ts
│   │   ├── assignments/
│   │   │   ├── bulk-to-university.ts
│   │   │   ├── to-pendamping.ts
│   │   │   └── remove.ts
│   │   ├── logbooks/
│   │   │   ├── create.ts
│   │   │   ├── update.ts
│   │   │   ├── delete.ts
│   │   │   ├── submit.ts
│   │   │   └── review.ts
│   │   ├── outputs/
│   │   │   ├── create.ts
│   │   │   ├── update.ts
│   │   │   ├── delete.ts
│   │   │   ├── submit.ts
│   │   │   └── review.ts
│   │   └── supervisor/
│   │       └── add-note.ts
│   ├── app/
│   │   └── api/                   # Route Handlers (GET)
│   │       ├── auth/[...all]/route.ts
│   │       ├── workspaces/route.ts
│   │       ├── universities/route.ts
│   │       ├── users/route.ts
│   │       ├── participants/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── assignments/route.ts
│   │       ├── logbooks/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── outputs/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── dashboard/
│   │       │   ├── stats/route.ts
│   │       │   ├── recent-logbooks/route.ts
│   │       │   └── charts/route.ts
│   │       ├── supervisor/
│   │       │   ├── universities/route.ts
│   │       │   ├── logbooks/route.ts
│   │       │   └── outputs/route.ts
│   │       └── uploads/
│   │           └── presigned-url/route.ts
│   ├── lib/
│   │   ├── auth.ts                # Better Auth server config
│   │   ├── auth-client.ts         # Better Auth client
│   │   ├── prisma.ts              # Prisma Client (exists)
│   │   ├── query-keys.ts          # TanStack Query key factory
│   │   └── utils.ts               # Utilities (exists)
│   ├── components/
│   │   └── providers/
│   │       ├── query-provider.tsx  # TanStack QueryClientProvider
│   │       └── role-provider.tsx   # Existing (will be replaced by session)
│   └── types/
│       └── index.ts               # Shared TypeScript types
```

---

## 9. Implementation Phases

### Phase 1 — Foundation 🏗️

| # | Task | Files |
|---|---|---|
| 1.1 | Update `schema.prisma` with complete schema | `prisma/schema.prisma` |
| 1.2 | Generate Prisma Client & push schema to DB | CLI |
| 1.3 | Setup Better Auth (server config, Prisma adapter) | `src/lib/auth.ts` |
| 1.4 | Setup Better Auth client | `src/lib/auth-client.ts` |
| 1.5 | Create API route handler for Better Auth | `src/app/api/auth/[...all]/route.ts` |
| 1.6 | Create `proxy.ts` for route protection | `proxy.ts` |
| 1.7 | Setup TanStack Query provider | `src/components/providers/query-provider.tsx` |
| 1.8 | Create query key factory | `src/lib/query-keys.ts` |
| 1.9 | Wrap root layout with QueryProvider | `src/app/layout.tsx` |
| 1.10 | Create seed script (default Super Admin) | `prisma/seed.ts` |

### Phase 2 — Auth & User Flow 🔐

| # | Task | Files |
|---|---|---|
| 2.1 | Connect `/login` to `authClient.signIn.email()` | `src/app/(auth)/login/page.tsx` |
| 2.2 | Create register server action | `src/actions/auth/register.ts` |
| 2.3 | Connect `/register` to `authClient.signUp.email()` + server action | `src/app/(auth)/register/page.tsx` |
| 2.4 | Replace RoleSwitcher with real session data | `src/components/app-sidebar.tsx` |
| 2.5 | Update sidebar navigation based on session role | `src/components/app-sidebar.tsx` |
| 2.6 | Create "Pending Approval" page | `src/app/(auth)/pending/page.tsx` |

### Phase 3 — Super Admin Module 👑

| # | Task | Files |
|---|---|---|
| 3.1 | Workspace CRUD (API + actions + hooks) | `api/workspaces/`, `actions/workspaces/` |
| 3.2 | University CRUD (API + actions + hooks) | `api/universities/`, `actions/universities/` |
| 3.3 | User approval (API + actions + hooks) | `api/users/`, `actions/users/` |
| 3.4 | Bulk assign participants to universities | `actions/assignments/` |
| 3.5 | Excel import for participants | `actions/participants/import-excel.ts` |

### Phase 4 — Pendamping Module 📝

| # | Task | Files |
|---|---|---|
| 4.1 | Participant list & detail (API + hooks) | `api/participants/` |
| 4.2 | Logbook CRUD (actions + hooks) | `actions/logbooks/` |
| 4.3 | Logbook list & detail (API + hooks) | `api/logbooks/` |
| 4.4 | Output CRUD (actions + hooks) | `actions/outputs/` |
| 4.5 | Output list & detail (API + hooks) | `api/outputs/` |
| 4.6 | Update participant fields | `actions/participants/update.ts` |

### Phase 5 — Admin Module ✅

| # | Task | Files |
|---|---|---|
| 5.1 | Logbook review page → real data | `admin/logbook-review/` |
| 5.2 | Output review page → real data | `admin/capaian-review/` |
| 5.3 | Assign participants to pendamping | `admin/assign/` |
| 5.4 | User confirmation (pendamping) | `admin/users/` |

### Phase 6 — Supervisor Module 👁️

| # | Task | Files |
|---|---|---|
| 6.1 | University monitoring (API + hooks) | `api/supervisor/` |
| 6.2 | Logbook monitoring | `supervisor/logbook/` |
| 6.3 | Output monitoring | `supervisor/outputs/` |
| 6.4 | Supervisor notes feature | `actions/supervisor/add-note.ts` |

### Phase 7 — Dashboard & Polish ✨

| # | Task | Files |
|---|---|---|
| 7.1 | Dashboard stats API (role-aware) | `api/dashboard/` |
| 7.2 | Connect StatCards, Charts, RecentLogbooks | `components/dashboard/` |
| 7.3 | File upload setup (presigned URL) | `api/uploads/` |
| 7.4 | Account & settings pages | `account/`, `settings/` |
| 7.5 | Global error handling & loading states | All pages |

---

## 10. Environment Variables

```env
# Already exists
DATABASE_URL="..."

# Better Auth
BETTER_AUTH_SECRET="<random-secret-32-chars>"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# MinIO (Localhost)
S3_ENDPOINT="http://localhost:9002"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="change_me_strong"
S3_BUCKET="pendamping-ai"
S3_REGION="us-east-1"
```

---

## 11. Important Notes

> [!IMPORTANT]
> **Prisma 7 + PostgreSQL Adapter** — This project uses `@prisma/adapter-pg` for Prisma Accelerate connection. Run schema changes via `npx prisma db push` (not `prisma migrate`) since Prisma Accelerate does not support shadow database.

> [!IMPORTANT]
> **Better Auth Tables** — Better Auth manages `User`, `Session`, `Account`, and `Verification` tables. The schema includes additional custom fields (`role`, `status`, `universityId`) on the `User` model. Use Better Auth's schema generation: `npx @better-auth/cli generate` to verify table compatibility.

> [!WARNING]
> **Workspace Scope** — Almost all queries must be filtered by `activeWorkspaceId` stored in the session. This prevents cross-workspace data leakage.

> [!TIP]
> **Incremental Integration** — Each phase can be deployed independently. Pages not yet connected will continue showing mock data, ensuring zero downtime.
