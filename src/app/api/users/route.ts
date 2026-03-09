import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roles = searchParams.getAll("role");
    const status = searchParams.get("status");
    const universityId = searchParams.get("universityId");

    const users = await prisma.user.findMany({
        where: {
            ...(roles.length > 0 ? { role: { in: roles as any } } : {}),
            ...(status ? { status: status as any } : {}),
            ...(universityId ? { universityId } : {}),
        },
        include: {
            university: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "UNIVERSITY_ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action"); // approve, reject, suspend

    if (!id || !action) {
        return new NextResponse("Missing ID or action", { status: 400 });
    }

    let status: "APPROVED" | "REJECTED" | "SUSPENDED";
    if (action === "approve") status = "APPROVED";
    else if (action === "reject") status = "REJECTED";
    else if (action === "suspend") status = "SUSPENDED";
    else return new NextResponse("Invalid action", { status: 400 });

    const user = await prisma.user.update({
        where: { id },
        data: { status },
    });

    return NextResponse.json(user);
}
