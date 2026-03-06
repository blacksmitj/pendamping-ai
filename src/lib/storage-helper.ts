/**
 * Helper to get the correct URL for a storage object.
 * If the path is already a full URL (e.g. from Google Auth or external source), it returns it as is.
 * Otherwise, it constructs the API route URL to fetch the signed MinIO URL.
 */
export function getStorageUrl(path?: string | null): string {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    return `/api/storage?path=${encodeURIComponent(path)}`;
}
