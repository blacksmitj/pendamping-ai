import { NextRequest, NextResponse } from "next/server";
import { getUploadUrl } from "@/lib/minio";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { folder, filename } = body;

        if (!folder || !filename) {
            return new NextResponse("Folder and filename are required", { status: 400 });
        }

        // Generate a secure unique filename 
        // e.g. folder/uuid-originalFilename
        const sanitizedName = filename.replace(/\s+/g, "_");
        const filePath = `${folder}/${crypto.randomUUID()}-${sanitizedName}`;

        const uploadUrl = await getUploadUrl(filePath, 5 * 60); // 5 minutes validity
        
        return NextResponse.json({
            uploadUrl,
            path: filePath
        });
    } catch (error) {
        console.error("Upload URL generation error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
