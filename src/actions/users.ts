"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { FOLDERS, uploadFile } from "@/lib/minio";


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

export async function getSuperAdminUsers() {
    const session = await getSession();
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const users = await prisma.user.findMany({
        where: {
            role: {
                in: ["UNIVERSITY_ADMIN", "UNIVERSITY_SUPERVISOR"],
            },
        },
        include: {
            university: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        university: u.university?.name || "Belum Terhubung",
        role: u.role === "UNIVERSITY_ADMIN" ? "Admin Univ" : "Pengawas",
        status: u.status === "PENDING" ? "Pending" : u.status === "APPROVED" ? "Aktif" : u.status === "REJECTED" ? "Ditolak" : "Nonaktif",
        registeredAt: u.createdAt.toISOString().split("T")[0],
        originalStatus: u.status,
    }));
}

export async function updateProfile(data: { name: string; image?: string | null }) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await auth.api.updateUser({
        headers: await headers(),
        body: {
            name: data.name,
            image: data.image,
        },
    });

    revalidatePath("/account");
}

export async function changeUserPassword(data: { currentPassword: string; newPassword: string }) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await auth.api.changePassword({
        headers: await headers(),
        body: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            revokeOtherSessions: true,
        },
    });
}

