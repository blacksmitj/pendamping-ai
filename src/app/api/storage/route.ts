import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/minio";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const url = new URL(req.url);
        const path = url.searchParams.get("path");

        if (!path) {
            return new NextResponse("Path is required", { status: 400 });
        }

        const signedUrl = await getDownloadUrl(path, 60 * 5); // 5 minutes validity
        
        return NextResponse.redirect(signedUrl);
    } catch (error) {
        console.error("Storage API error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
