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
