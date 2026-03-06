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
    const universityId = searchParams.get("universityId");
    const workspaceId = searchParams.get("workspaceId");
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const participants = await prisma.participant.findMany({
        where: {
            ...(universityId ? { universityId } : {}),
            ...(workspaceId ? { workspaceId } : {}),
            ...(status ? { status } : {}),
            ...(query ? {
                OR: [
                    { fullName: { contains: query, mode: "insensitive" } },
                    { idTkm: { contains: query, mode: "insensitive" } },
                ]
            } : {}),
        },
        include: {
            university: true,
        },
        orderBy: { fullName: "asc" },
    });

    return NextResponse.json(participants);
}
