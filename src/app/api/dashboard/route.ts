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
    const user = session.user as any;
    const universityId = searchParams.get("universityId") || user.universityId;

    // Stats aggregation
    const [
        participantCount,
        logbookCount,
        pendingUsers,
        approvedOutputs
    ] = await prisma.$transaction([
        prisma.participant.count({ where: universityId ? { universityId } : {} }),
        prisma.logbook.count({
            where: universityId ? { pendamping: { universityId } } : {}
        }),
        prisma.user.count({ where: { status: "PENDING", ...(universityId ? { universityId } : {}) } }),
        prisma.output.count({
            where: {
                reviewStatus: "APPROVED",
                ...(universityId ? { participant: { universityId } } : {})
            }
        }),
    ]);

    // Recent activity (Logbooks)
    const recentLogbooks = await prisma.logbook.findMany({
        where: universityId ? { pendamping: { universityId } } : {},
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { pendamping: { select: { name: true } } }
    });

    return NextResponse.json({
        stats: {
            participants: participantCount,
            logbooks: logbookCount,
            pendingUsers: pendingUsers,
            approvedOutputs: approvedOutputs,
        },
        recentActivity: recentLogbooks,
    });
}
