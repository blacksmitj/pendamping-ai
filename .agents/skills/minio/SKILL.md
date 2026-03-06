---
name: minio-integration
description: MinIO integration patterns.
---

# MinIO Skill

## Operations
- **Upload**: `uploadFileToMinio(file, path)`.
- **View**: `getStorageUrl(path)`.

## Config
- Host: `MINIO_ENDPOINT`.
- Path: Always relative (`folder/filename`).
