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
    const mentorId = searchParams.get("mentorId");
    const universityId = searchParams.get("universityId");
    const reviewStatus = searchParams.get("status");
    const id = searchParams.get("id");

    if (id) {
        const logbook = await prisma.logbook.findUnique({
            where: { id },
            include: {
                logbookParticipants: {
                    include: { participant: { select: { id: true, fullName: true, tkmId: true } } }
                },
                reviews: { orderBy: { createdAt: "desc" } }
            }
        });

        if (!logbook) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(logbook);
    }

    const logbooks = await prisma.logbook.findMany({
        where: {
            ...(mentorId ? { mentorId } : {}),
            ...(reviewStatus ? { reviewStatus: reviewStatus as any } : {}),
            ...(universityId ? {
                mentor: { universityId }
            } : {}),
        },
        include: {
            mentor: {
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

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const logbook = await prisma.logbook.create({
        data: {
            date: new Date(data.date),
            deliveryMethod: data.deliveryMethod,
            meetingType: data.meetingType,
            visitType: data.visitType,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            studyHours: data.studyHours,
            material: data.material,
            summary: data.summary,
            obstacle: data.obstacle,
            solution: data.solution,
            totalExpense: data.totalExpense,
            documentationUrls: data.documentationUrls,
            expenseProofUrl: data.expenseProofUrl,
            noExpenseReason: data.noExpenseReason,
            mentorId: session.user.id,
            logbookParticipants: {
                create: data.participantIds.map((id: string) => ({ participantId: id }))
            }
        },
    });

    return NextResponse.json(logbook);
}

export async function PATCH(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action"); // update, submit, approve, revision, reject

    if (!id) {
        return new NextResponse("Missing ID", { status: 400 });
    }

    const body = await req.json();

    if (action === "update") {
        // Update logbook content
        const logbook = await prisma.logbook.update({
            where: { id, mentorId: session.user.id },
            data: {
                date: new Date(body.date),
                deliveryMethod: body.deliveryMethod,
                meetingType: body.meetingType,
                visitType: body.visitType,
                startTime: new Date(body.startTime),
                endTime: new Date(body.endTime),
                studyHours: body.studyHours,
                material: body.material,
                summary: body.summary,
                obstacle: body.obstacle,
                solution: body.solution,
                totalExpense: body.totalExpense,
                documentationUrls: body.documentationUrls,
                expenseProofUrl: body.expenseProofUrl,
                noExpenseReason: body.noExpenseReason,
                logbookParticipants: {
                    deleteMany: {}, // Clear old participants
                    create: body.participantIds.map((pId: string) => ({ participantId: pId }))
                }
            },
        });
        return NextResponse.json(logbook);
    }

    if (action === "submit") {
        const logbook = await prisma.logbook.update({
            where: { id, mentorId: session.user.id },
            data: { reviewStatus: "SUBMITTED" },
        });
        return NextResponse.json(logbook);
    }

    if (!action) {
        return new NextResponse("Missing action", { status: 400 });
    }

    if (session.user.role !== "UNIVERSITY_ADMIN" && session.user.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const reviewStatus = action.toUpperCase();

    await prisma.$transaction([
        prisma.logbook.update({
            where: { id },
            data: { reviewStatus: reviewStatus as any },
        }),
        prisma.logbookReview.create({
            data: {
                logbookId: id,
                reviewerId: session.user.id,
                action: reviewStatus as any,
                note: body.note,
            }
        })
    ]);

    return new NextResponse("OK", { status: 200 });
}
