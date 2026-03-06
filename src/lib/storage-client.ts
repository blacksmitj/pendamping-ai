import imageCompression from "browser-image-compression";

/**
 * Helper to upload a file directly to MinIO from the client side.
 * This bypasses Next.js server actions body limit (1MB).
 * 
 * @param file The file to upload.
 * @param folder The folder in MinIO where the file should be stored (e.g. "avatar", "photo", "pdf")
 * @returns The relative path of the uploaded file to be saved in the database.
 */
export async function uploadFileToMinio(file: File, folder: string): Promise<string> {
    let fileToUpload = file;

    // Client-side file validation and compression
    if (file.type.startsWith("image/")) {
        // Compress images if they are larger than 1MB
        if (file.size > 1024 * 1024) {
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };
                fileToUpload = await imageCompression(file, options);
            } catch (error) {
                console.error("Image compression failed:", error);
                // Fallback to original file or throw error based on preference
                throw new Error("Gagal melakukan kompresi gambar");
            }
        }
    } else {
        // Document size validation (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error("Ukuran dokumen tidak boleh melebihi 5MB");
        }
    }

    // 1. Get presigned upload URL from our API
    const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            filename: fileToUpload.name,
            folder,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to get upload URL");
    }

    const { uploadUrl, path } = await res.json();

    // 2. Upload file directly to MinIO using the presigned URL
    const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": fileToUpload.type || "application/octet-stream",
        },
        body: fileToUpload,
    });

    if (!uploadRes.ok) {
        throw new Error("Failed to upload file to storage");
    }

    // 3. Return the relative path to be saved in DB
    return path;
}
