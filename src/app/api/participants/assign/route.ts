import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !["UNIVERSITY_ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { participantIds, mentorId } = body;

        if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0 || !mentorId) {
            return new NextResponse("Invalid request data", { status: 400 });
        }

        // Verify the mentor exists and is actually a mentor
        const mentor = await prisma.user.findUnique({
            where: { id: mentorId, role: "MENTOR" },
        });

        if (!mentor) {
            return new NextResponse("Mentor not found or invalid role", { status: 404 });
        }

        // Create assignment records inside a transaction
        await prisma.$transaction(async (tx) => {
            const chunkSize = 100;
            for (let i = 0; i < participantIds.length; i += chunkSize) {
                const chunk = participantIds.slice(i, i + chunkSize);
                await Promise.all(chunk.map(participantId =>
                    tx.participantAssignment.create({
                        data: {
                            participantId,
                            mentorId,
                        }
                    })
                ));
            }
        }, {
            timeout: 30000 // 30 seconds for bulk assignment
        });

        return NextResponse.json({ message: "Successfully assigned participants" });
    } catch (error: any) {
        console.error("Assign error:", error);
        return new NextResponse(error.message || "Internal server error", { status: 500 });
    }
}
