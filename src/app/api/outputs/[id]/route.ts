import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const output = await prisma.output.findUnique({
        where: { id },
        include: {
            participant: {
                include: {
                    university: true,
                    assignments: {
                        take: 1,
                        include: {
                            mentor: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            },
            employees: true,
            reviews: { orderBy: { createdAt: "desc" } }
        },
    });

    if (!output) {
        return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(output);
}
