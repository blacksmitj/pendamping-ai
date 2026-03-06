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
    const participantId = searchParams.get("participantId");
    const reviewStatus = searchParams.get("status");
    const universityId = searchParams.get("universityId");

    const outputs = await prisma.output.findMany({
        where: {
            ...(participantId ? { participantId } : {}),
            ...(reviewStatus ? { reviewStatus: reviewStatus as any } : {}),
            ...(universityId ? {
                participant: { universityId }
            } : {}),
        },
        include: {
            participant: { select: { fullName: true, idTkm: true } },
            employees: true,
            reviews: { orderBy: { createdAt: "desc" }, take: 1 }
        },
        orderBy: { reportMonth: "desc" },
    });

    return NextResponse.json(outputs);
}
