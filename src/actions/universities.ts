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

export async function createUniversity(data: {
    name: string;
    code: string;
    workspaceId: string;
    address?: string;
    city?: string;
    province?: string;
}) {
    const session = await getSession();
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const university = await prisma.university.create({
        data,
    });

    revalidatePath("/super/universities");
    return university;
}

export async function updateUniversity(id: string, data: {
    name?: string;
    code?: string;
    address?: string;
    city?: string;
    province?: string;
}) {
    const session = await getSession();
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN_UNIV")) {
        throw new Error("Unauthorized");
    }

    const university = await prisma.university.update({
        where: { id },
        data,
    });

    revalidatePath("/super/universities");
    revalidatePath(`/admin/university/${id}`);
    return university;
}

export async function deleteUniversity(id: string) {
    const session = await getSession();
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    await prisma.university.delete({
        where: { id },
    });

    revalidatePath("/super/universities");
}
