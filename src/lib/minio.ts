import * as Minio from "minio";

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ROOT_USER || "minioadmin",
    secretKey: process.env.MINIO_ROOT_PASSWORD || "minioadmin",
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "pendamping-ai";

export const FOLDERS = {
    AVATAR: "avatar/",
    PDF: "pdf/",
    PHOTO: "photo/",
};

/**
 * Ensure the main bucket exists, create it if it doesn't.
 */
export async function ensureBucket() {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME);
        console.log(`Bucket "${BUCKET_NAME}" created.`);
        // Bucket is private by default, no need to set public policy.
    }
}

/**
 * Upload a file to MinIO and return its relative path.
 */
export async function uploadFile(fileName: string, buffer: Buffer, contentType?: string) {
    await ensureBucket();

    await minioClient.putObject(BUCKET_NAME, fileName, buffer, buffer.length, {
        "Content-Type": contentType || "application/octet-stream"
    });

    // Return the relative path (folder/filename) to be saved in the database
    return fileName;
}

/**
 * Get a temporary pre-signed URL for a private file.
 */
export async function getDownloadUrl(fileName: string, expiry = 24 * 60 * 60) {
    return await minioClient.presignedGetObject(BUCKET_NAME, fileName, expiry);
}

/**
 * Get a temporary pre-signed URL for uploading a file directly to MinIO.
 */
export async function getUploadUrl(fileName: string, expiry = 5 * 60) {
    await ensureBucket();
    return await minioClient.presignedPutObject(BUCKET_NAME, fileName, expiry);
}
