"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getSession() {
    return await auth.api.getSession({
        headers: await headers(),
    });
}

export async function updateParticipant(id: string, data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const participant = await prisma.participant.update({
        where: { id },
        data: {
            ...data,
            updatedAt: new Date(),
        },
    });

    revalidatePath(`/participant/${id}`);
    revalidatePath("/participant");
    return participant;
}

export async function toggleParticipantStatus(id: string, status: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const participant = await prisma.participant.update({
        where: { id },
        data: { status },
    });

    revalidatePath(`/participant/${id}`);
    revalidatePath("/participant");
    return participant;
}

// Bulk assign participants to university (Super Admin)
export async function bulkAssignToUniversity(participantIds: string[], universityId: string) {
    const session = await getSession();
    if (!session || session.user.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

    await prisma.participant.updateMany({
        where: { id: { in: participantIds } },
        data: { universityId },
    });

    revalidatePath("/super/assign");
    revalidatePath("/participant");
}

export async function getParticipants() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const dbSession = await prisma.session.findUnique({
        where: { token: session.session.token }
    });
    const activeWorkspaceId = dbSession?.activeWorkspaceId;
    const { role, id: userId, universityId } = session.user;

    let whereClause: any = {};

    if (activeWorkspaceId) {
        whereClause.workspaceId = activeWorkspaceId;
    }

    if (role === "MENTOR") {
        whereClause.assignments = {
            some: {
                mentorId: userId,
            },
        };
    } else if (role === "UNIVERSITY_ADMIN" || role === "UNIVERSITY_SUPERVISOR") {
        if (universityId) {
            whereClause.universityId = universityId;
        } else {
            return []; // Universiy staff with no university assigned
        }
    }

    const participants = await prisma.participant.findMany({
        where: whereClause,
        orderBy: {
            fullName: "asc",
        },
        include: {
            university: true,
        }
    });

    return participants;
}

export async function getParticipantById(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const participant = await prisma.participant.findUnique({
        where: { id },
        include: {
            university: true,
            assignments: {
                include: {
                    mentor: true,
                }
            },
            logbookParticipants: {
                include: {
                    logbook: true,
                }
            },
            outputs: true,
        }
    });

    return participant;
}

export async function updateParticipantMentoringStatus(id: string, data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const participant = await prisma.participant.update({
        where: { id },
        data: {
            communicationStatus: data.communicationStatus,
            fundDisbursementStatus: data.fundDisbursementStatus,
            status: data.status,
            dropReason: data.dropReason,
            updatedAt: new Date(),
        },
    });

    revalidatePath(`/participant/${id}`);
    revalidatePath("/participant");
    return participant;
}
