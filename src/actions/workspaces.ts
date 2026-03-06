"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getSession() {
    return await auth.api.getSession({
        headers: await headers(),
    });
}

export async function createWorkspace(data: {
    name: string;
    startDate: Date;
    endDate: Date;
    description?: string;
}) {
    const session = await getSession();
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const workspace = await prisma.workspace.create({
        data: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description,
        },
    });

    revalidatePath("/super/workspace");
    return workspace;
}

export async function getWorkspaces() {
    const session = await getSession();
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    return await prisma.workspace.findMany({
        include: {
            _count: {
                select: {
                    universities: true,
                    participants: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function updateWorkspace(id: string, data: {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    status?: "ACTIVE" | "COMPLETED" | "ARCHIVED";
    description?: string;
}) {
    const session = await getSession();
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const workspace = await prisma.workspace.update({
        where: { id },
        data,
    });

    revalidatePath("/super/workspace");
    return workspace;
}
