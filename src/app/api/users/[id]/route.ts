import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            university: true,
            assignments: {
                include: {
                    participant: true
                }
            },
            _count: {
                select: {
                    logbooks: true,
                    assignments: true,
                }
            }
        },
    });

    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }

    // Get total study hours
    const studyHoursAggregate = await prisma.logbook.aggregate({
        where: { mentorId: id },
        _sum: {
            studyHours: true
        }
    });

    const totalStudyHours = studyHoursAggregate._sum.studyHours || 0;

    return NextResponse.json({
        ...user,
        totalStudyHours
    });
}
