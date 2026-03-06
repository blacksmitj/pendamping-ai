"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FOLDERS, uploadFile } from "@/lib/minio";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getMyUniversity() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user?.universityId) return null;

        return await prisma.university.findUnique({
            where: { id: session.user.universityId },
            include: {
                users: {
                    where: { role: "MENTOR" },
                    include: {
                        _count: {
                            select: { 
                                assignments: true,
                                logbooks: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch my university:", error);
        return null;
    }
}

export async function getUniversities() {
    try {
        return await prisma.university.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { users: { where: { role: "MENTOR" } } }
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch universities:", error);
        return [];
    }
}

export async function getUniversityById(id: string) {
    try {
        return await prisma.university.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { users: { where: { role: "MENTOR" } } }
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch university by ID:", error);
        return null;
    }
}

export async function createUniversity(data: {
    name: string;
    code: string;
    city?: string;
    address?: string;
    province?: string;
    logoUrl?: string;
    workspaceId: string;
}) {
    try {
        const university = await prisma.university.create({
            data: {
                ...data,
                status: "ACTIVE",
            },
        });
        revalidatePath("/super/university");
        return { success: true, data: university };
    } catch (error) {
        console.error("Failed to create university:", error);
        return { success: false, error: "Failed to create university" };
    }
}

export async function updateUniversity(id: string, data: Partial<{
    name: string;
    code: string;
    city: string;
    address: string;
    province: string;
    logoUrl: string;
    status: string;
}>) {
    try {
        const university = await prisma.university.update({
            where: { id },
            data,
        });
        revalidatePath("/super/university");
        revalidatePath(`/university`);
        return { success: true, data: university };
    } catch (error) {
        console.error("Failed to update university:", error);
        return { success: false, error: "Failed to update university" };
    }
}

export async function deleteUniversity(id: string) {
    try {
        await prisma.university.delete({ where: { id } });
        revalidatePath("/super/university");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete university:", error);
        return { success: false, error: "Failed to delete university" };
    }
}

