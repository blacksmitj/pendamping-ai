---
description: Rules for object storage via MinIO.
---

# MinIO Rules (Optimized)

## 1. Architecture
- **Direct Upload**: Client -> MinIO via **Signed URL** (PUT).
- **Backend Role**: Generate Signed URLs via `/api/upload-url`.
- **Path Storage**: Save **relative path** only (`avatar/file.png`) in DB.

## 2. Organization
- `avatar/`: Profiles.
- `pdf/`: Documents.
- `photo/`: Logos/Photos.

## 3. Implementation
- Use `uploadFileToMinio` from `src/lib/storage-client.ts`.
- Use `getStorageUrl` from `src/lib/storage-helper.ts` for display.
