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

    const participant = await prisma.participant.findUnique({
        where: { id },
        include: {
            university: true,
            assignments: {
                include: {
                    mentor: true,
                },
            },
            logbookParticipants: {
                include: {
                    logbook: true,
                },
            },
            outputs: true,
        },
    });

    if (!participant) {
        return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(participant);
}

export async function PATCH(
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
    const body = await req.json();

    const participant = await prisma.participant.update({
        where: { id },
        data: {
            communicationStatus: body.communicationStatus,
            fundDisbursementStatus: body.fundDisbursementStatus,
            status: body.status,
            dropReason: body.dropReason,
        },
    });

    return NextResponse.json(participant);
}
