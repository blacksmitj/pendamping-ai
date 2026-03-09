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
    const participantId = searchParams.get("participantId");
    const reviewStatus = searchParams.get("status");

    // Auto-filter based on role
    let effectiveUniversityId = searchParams.get("universityId");
    let mentorId = null;

    if (session.user.role === "MENTOR") {
        mentorId = session.user.id;
    } else if (session.user.role === "UNIVERSITY_ADMIN" || session.user.role === "UNIVERSITY_SUPERVISOR") {
        effectiveUniversityId = (session.user as any).universityId || effectiveUniversityId;
    }

    const outputs = await prisma.output.findMany({
        where: {
            ...(participantId ? { participantId } : {}),
            ...(reviewStatus ? { reviewStatus: reviewStatus as any } : {}),
            ...(effectiveUniversityId ? {
                participant: { universityId: effectiveUniversityId }
            } : {}),
            ...(mentorId ? {
                participant: {
                    assignments: {
                        some: { mentorId }
                    }
                }
            } : {}),
        },
        include: {
            participant: {
                select: {
                    fullName: true,
                    tkmId: true,
                    businessSector: true,
                    assignments: {
                        take: 1,
                        select: {
                            mentor: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            },
            employees: true,
            reviews: { orderBy: { createdAt: "desc" }, take: 1 }
        },

        orderBy: { reportMonth: "desc" },
    });

    return NextResponse.json(outputs);
}


export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: outputData, employees } = await req.json();
    const output = await prisma.output.create({
        data: {
            ...outputData,
            reportMonth: new Date(outputData.reportMonth),
            employees: {
                create: employees
            }
        },
    });

    return NextResponse.json(output);
}

export async function PATCH(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user.role !== "UNIVERSITY_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action"); // approve, revision, reject

    if (!id || !action) {
        return new NextResponse("Missing ID or action", { status: 400 });
    }

    const body = await req.json();
    const reviewStatus = action.toUpperCase();

    await prisma.$transaction([
        prisma.output.update({
            where: { id },
            data: { reviewStatus: reviewStatus as any },
        }),
        prisma.outputReview.create({
            data: {
                outputId: id,
                reviewerId: session.user.id,
                action: reviewStatus as any,
                note: body.note,
            }
        })
    ]);

    return new NextResponse("OK", { status: 200 });
}
