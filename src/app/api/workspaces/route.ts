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

    const workspaces = await prisma.workspace.findMany({
        include: {
            _count: {
                select: {
                    universities: true,
                    participants: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(workspaces);
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const workspace = await prisma.workspace.create({
        data: {
            name: body.name,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            description: body.description,
        },
    });

    return NextResponse.json(workspace);
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

    const body = await req.json();
    const workspace = await prisma.workspace.update({
        where: { id },
        data: {
            ...body,
            startDate: body.startDate ? new Date(body.startDate) : undefined,
            endDate: body.endDate ? new Date(body.endDate) : undefined,
        },
    });

    return NextResponse.json(workspace);
}
