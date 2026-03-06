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

export async function createLogbook(data: {
    date: Date;
    deliveryMethod: "FACE_TO_FACE" | "ONLINE";
    meetingType: "INDIVIDUAL" | "GROUP";
    visitType: string;
    startTime: Date;
    endTime: Date;
    studyHours: number;
    material: string;
    summary: string;
    obstacle: string;
    solution: string;
    totalExpense: number;
    documentationUrls: string[];
    expenseProofUrl?: string;
    noExpenseReason?: string;
    participantIds: string[];
}) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const logbook = await prisma.logbook.create({
        data: {
            date: data.date,
            deliveryMethod: data.deliveryMethod,
            meetingType: data.meetingType,
            visitType: data.visitType,
            startTime: data.startTime,
            endTime: data.endTime,
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
                create: data.participantIds.map(id => ({ participantId: id }))
            }
        },
    });

    revalidatePath("/logbook");
    return logbook;
}

export async function submitLogbook(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await prisma.logbook.update({
        where: { id, mentorId: session.user.id },
        data: { reviewStatus: "SUBMITTED" },
    });

    revalidatePath("/logbook");
}

export async function reviewLogbook(id: string, action: "APPROVED" | "REVISION" | "REJECTED", note?: string) {
    const session = await getSession();
    if (!session || (session.user.role !== "UNIVERSITY_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("Unauthorized");
    }

    await prisma.$transaction([
        prisma.logbook.update({
            where: { id },
            data: { reviewStatus: action },
        }),
        prisma.logbookReview.create({
            data: {
                logbookId: id,
                reviewerId: session.user.id,
                action: action,
                note: note,
            }
        })
    ]);

    revalidatePath("/logbook");
}
