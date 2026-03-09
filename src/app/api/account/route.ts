import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action"); // profile, password

    if (!action) {
        return new NextResponse("Missing action", { status: 400 });
    }

    const body = await req.json();

    try {
        if (action === "profile") {
            await auth.api.updateUser({
                headers: await headers(),
                body: {
                    name: body.name,
                    image: body.image,
                },
            });
            return new NextResponse("Profile updated", { status: 200 });
        }

        if (action === "password") {
            await auth.api.changePassword({
                headers: await headers(),
                body: {
                    currentPassword: body.currentPassword,
                    newPassword: body.newPassword,
                    revokeOtherSessions: true,
                },
            });
            return new NextResponse("Password changed", { status: 200 });
        }

        return new NextResponse("Invalid action", { status: 400 });
    } catch (error: any) {
        return new NextResponse(error.message || "An error occurred", { status: 500 });
    }
}
