---
name: minio-integration
description: Guidelines and utility functions for integrating MinIO object storage in the Pendamping AI project.
---

# MinIO Integration Skill

This skill provides instructions and patterns for using MinIO for object storage (avatars, documents, proofs) in the project.

## Configuration

MinIO settings are defined in `.env`:
- `MINIO_ENDPOINT`: The hostname of the MinIO server.
- `MINIO_PORT`: The API port (default 9002).
- `MINIO_ROOT_USER`: Access Key.
- `MINIO_ROOT_PASSWORD`: Secret Key.
- `MINIO_USE_SSL`: Boolean (true for production, false for local).

## MinIO Client Utility

The client is initialized in `src/lib/minio.ts`. Use this singleton instance for all storage operations.

### Key Operations

1. **Bucket Initialization**: Ensure buckets exist before uploading.
   - Recommended buckets: `universities`, `participants`, `logbooks`, `outputs`.

2. **File Upload**:
   - Use `putObject` for general uploads.
   - Always sanitize filenames.
   - Use path-based organization: `universities/logos/{universityId}-{timestamp}.png`.

3. **File Retrieval**:
   - Use `presignedUrl` (GET) for temporary access if buckets are private.
   - For public-read buckets, the URL can be constructed as `${ENDPOINT}:${PORT}/${BUCKET}/${PATH}`.

## Implementation Pattern

```typescript
import { minioClient } from "@/lib/minio";

// Upload example
export async function uploadToMinio(bucket: string, path: string, buffer: Buffer) {
    await minioClient.putObject(bucket, path, buffer);
    return await minioClient.presignedUrl("GET", bucket, path, 24 * 60 * 60);
}
```

## Security Best Practices
- Never expose Secret Keys on the frontend.
- Use Server Actions or API routes for uploads.
- Implement file type and size validation before uploading.
