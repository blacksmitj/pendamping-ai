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

export async function approveUser(id: string) {
    const session = await getSession();
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "UNIVERSITY_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id },
        data: { status: "APPROVED" },
    });

    revalidatePath("/super/users");
    revalidatePath("/admin/users");
    return user;
}

export async function rejectUser(id: string) {
    const session = await getSession();
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "UNIVERSITY_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id },
        data: { status: "REJECTED" },
    });

    revalidatePath("/super/users");
    revalidatePath("/admin/users");
    return user;
}

export async function suspendUser(id: string) {
    const session = await getSession();
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id },
        data: { status: "SUSPENDED" },
    });

    revalidatePath("/super/users");
    return user;
}
