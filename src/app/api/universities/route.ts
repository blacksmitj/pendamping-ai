import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const my = searchParams.get("my");

    if (my === "true") {
        if (!session.user.universityId) {
            return new NextResponse("No university associated with user", { status: 404 });
        }

        const university = await prisma.university.findUnique({
            where: { id: session.user.universityId },
            include: {
                users: {
                    select: {
                        name: true,
                        email: true,
                        _count: {
                            select: {
                                assignments: true,
                                logbooks: true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(university);
    }

    const universities = await prisma.university.findMany({
        where: workspaceId ? { workspaceId } : {},
        include: {
            _count: {
                select: { users: { where: { role: "MENTOR" } } }
            }
        },
        orderBy: { name: "asc" },
    });

    return NextResponse.json(universities);
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const university = await prisma.university.create({
        data: {
            ...body,
            status: body.status || "ACTIVE",
        },
    });

    return NextResponse.json(university);
}

export async function PATCH(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Missing ID", { status: 400 });

    try {
        const body = await req.json();
        const university = await prisma.university.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(university);
    } catch (error: any) {
        console.error("Failed to update university:", error);
        return new NextResponse(error.message || "Failed to update university", { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Missing ID", { status: 400 });

    await prisma.university.delete({
        where: { id },
    });

    return new NextResponse(null, { status: 204 });
}
