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

export async function createOutput(data: any, employees: any[]) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const output = await prisma.output.create({
        data: {
            ...data,
            employees: {
                create: employees
            }
        },
    });

    revalidatePath("/output");
    return output;
}

export async function reviewOutput(id: string, action: "APPROVED" | "REVISION" | "REJECTED", note?: string) {
    const session = await getSession();
    if (!session || (session.user.role !== "UNIVERSITY_ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        throw new Error("Unauthorized");
    }

    await prisma.$transaction([
        prisma.output.update({
            where: { id },
            data: { reviewStatus: action },
        }),
        prisma.outputReview.create({
            data: {
                outputId: id,
                reviewerId: session.user.id,
                action: action,
                note: note,
            }
        })
    ]);

    revalidatePath("/output");
}
