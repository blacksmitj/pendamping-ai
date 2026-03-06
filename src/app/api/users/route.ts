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
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const universityId = searchParams.get("universityId");

    const users = await prisma.user.findMany({
        where: {
            ...(role ? { role: role as any } : {}),
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
