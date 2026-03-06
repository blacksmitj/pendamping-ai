import * as Minio from "minio";

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ROOT_USER || "minioadmin",
    secretKey: process.env.MINIO_ROOT_PASSWORD || "minioadmin",
});

export const BUCKETS = {
    UNIVERSITIES: "universities",
    PARTICIPANTS: "participants",
    LOGBOOKS: "logbooks",
    OUTPUTS: "outputs",
};

/**
 * Ensure a bucket exists, create it if it doesn't.
 */
export async function ensureBucket(bucketName: string) {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
        await minioClient.makeBucket(bucketName);
        console.log(`Bucket "${bucketName}" created.`);
        
        // Optional: Set policy for public read if needed for logos
        if (bucketName === BUCKETS.UNIVERSITIES) {
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${bucketName}/*`],
                    },
                ],
            };
            await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
        }
    }
}

/**
 * Upload a file to MinIO and return its URL.
 */
export async function uploadFile(bucketName: string, fileName: string, buffer: Buffer, contentType?: string) {
    await ensureBucket(bucketName);
    
    await minioClient.putObject(bucketName, fileName, buffer, buffer.length, {
        "Content-Type": contentType || "application/octet-stream"
    });
    
    // Construct public URL (assuming the bucket has public read policy)
    const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
    const host = process.env.MINIO_ENDPOINT || "localhost";
    const port = process.env.MINIO_PORT || "9002"; // Use 9002 as default for API
    
    return `${protocol}://${host}:${port}/${bucketName}/${fileName}`;
}

/**
 * Get a temporary pre-signed URL for a private file.
 */
export async function getDownloadUrl(bucketName: string, fileName: string, expiry = 24 * 60 * 60) {
    return await minioClient.presignedGetObject(bucketName, fileName, expiry);
}
