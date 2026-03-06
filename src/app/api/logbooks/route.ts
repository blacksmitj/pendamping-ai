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
    const pendampingId = searchParams.get("pendampingId");
    const universityId = searchParams.get("universityId");
    const reviewStatus = searchParams.get("status");

    const logbooks = await prisma.logbook.findMany({
        where: {
            ...(pendampingId ? { pendampingId } : {}),
            ...(reviewStatus ? { reviewStatus: reviewStatus as any } : {}),
            ...(universityId ? {
                pendamping: { universityId }
            } : {}),
        },
        include: {
            pendamping: {
                select: { name: true, university: { select: { name: true } } }
            },
            logbookParticipants: {
                include: { participant: { select: { fullName: true } } }
            },
            reviews: { orderBy: { createdAt: "desc" }, take: 1 }
        },
        orderBy: { date: "desc" },
    });

    return NextResponse.json(logbooks);
}
