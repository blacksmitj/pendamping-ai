import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "SUPER_ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { workspaceId, participants } = body;

        if (!workspaceId || !participants || !Array.isArray(participants)) {
            return new NextResponse("Invalid request body", { status: 400 });
        }

        // Fetch all universities for mapping
        const universities = await prisma.university.findMany({
            select: { id: true, code: true }
        });

        const univMap = new Map<string, string>();
        universities.forEach(u => {
            univMap.set(u.code.toLowerCase(), u.id);
            univMap.set(u.id, u.id);
        });

        // Process participants in a transaction to handle Upserts (Create or Update)
        // Since Prisma createMany doesn't support ON CONFLICT UPDATE in all providers,
        // and we want to preserve existing data while updating universityId
        const results = await prisma.$transaction(async (tx) => {
            const processed = [];

            // Chunk processing to avoid overwhelming the database/connection pool
            const chunkSize = 100;
            for (let i = 0; i < participants.length; i += chunkSize) {
                const chunk = participants.slice(i, i + chunkSize);
                const chunkPromises = chunk.map((p: any) => {
                    const univIdOrCode = p.id_universitas?.toString() || p.kode_universitas?.toString();
                    const universityId = univIdOrCode ? univMap.get(univIdOrCode.toLowerCase()) : null;
                    const tkmId = p.id_tkm?.toString();

                    if (!tkmId) return null;

                    const participantData = {
                        fullName: p.nama_pendaftar || "No Name",
                        universityId,
                        workspaceId,
                        // Map other fields only if they exist in the incoming data
                        ...(p.nik_pendaftar && { registrantNationalId: p.nik_pendaftar.toString() }),
                        ...(p.tanggal_daftar && { registrationDate: new Date(p.tanggal_daftar) }),
                        ...(p.whatsapp && { whatsapp: p.whatsapp.toString() }),
                        // Add more fields if necessary, but keep it minimal for "Assign" mode
                    };

                    return tx.participant.upsert({
                        where: { tkmId },
                        update: {
                            universityId,
                            // Only update other fields if they were provided (Basic info)
                            ...(p.nama_pendaftar && { fullName: p.nama_pendaftar }),
                        },
                        create: {
                            ...participantData,
                            tkmId,
                        },
                    });
                }).filter(Boolean);

                const chunkResults = await Promise.all(chunkPromises);
                processed.push(...chunkResults);
            }

            return processed;
        }, {
            timeout: 60000 // Increased to 60 seconds for very large imports
        });

        return NextResponse.json({
            success: true,
            count: results.length,
        });
    } catch (error: any) {
        console.error("Import error:", error);
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
}
