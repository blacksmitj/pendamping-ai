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

        // Use transaction for bulk creation
        // Note: createMany is supported in PostgreSQL with Prisma
        const result = await prisma.participant.createMany({
            data: participants.map((p: any) => ({
                workspaceId,
                tkmId: p.id_tkm?.toString(),
                fullName: p.nama_pendaftar || "No Name",
                registrantNationalId: p.nik_pendaftar?.toString(),
                registrationDate: p.tanggal_daftar ? new Date(p.tanggal_daftar) : null,
                birthPlace: p.tempat_lahir,
                lastEducation: p.pendidikan_terakhir,
                currentActivity: p.aktivitas_saat_ini,
                isDisabled: p.apakah_penyandang_disabilitas === "Ya" || p.apakah_penyandang_disabilitas === true,
                disabilityType: p.jenis_disabilitas,
                whatsapp: p.whatsapp?.toString(),
                socialPlatform: p.platform_media_sosial,
                socialAccount: p.akun_media_sosial,
                socialLink: p.link_media_sosial,
                relativeName1: p.nama_kerabat_1,
                relativePhone1: p.telepon_kerabat_1?.toString(),
                relativeStatus1: p.status_kerabat_1,
                relativeName2: p.nama_kerabat_2,
                relativePhone2: p.telepon_kerabat_2?.toString(),
                relativeStatus2: p.status_kerabat_2,
                businessName: p.nama_usaha,
                businessSector: p.sektor_usaha,
                businessType: p.jenis_usaha,
                businessDesc: p.deskripsi_usaha,
                mainProduct: p.produk_utama,
                businessLocation: p.lokasi_usaha,
                locationOwnership: p.kepemilikan_lokasi_usaha,
                sameAsResidence: p.alamat_usaha_dan_alamat_domisili_sama === "Ya" || p.alamat_usaha_dan_alamat_domisili_sama === true,
                businessAddress: p.alamat_usaha,
                businessProvince: p.provinsi_usaha,
                businessCity: p.kota_usaha,
                businessDistrict: p.kecamatan_usaha,
                businessSubDistrict: p.kelurahan_usaha,
                businessPostalCode: p.kode_pos_usaha?.toString(),
                salesChannel: p.saluran_pemasaran,
                marketingArea: p.wilayah_pemasaran,
                marketingCountry: p.wilayah_negara_pemasaran,
                businessPartner: p.mitra_usaha,
                partnerCount: p.jumlah_mitra_usaha ? parseInt(p.jumlah_mitra_usaha.toString()) : null,
                revenuePerPeriod: p.omset_per_periode ? parseFloat(p.omset_per_periode.toString()) : null,
                profitPerPeriod: p.laba_per_periode ? parseFloat(p.laba_per_periode.toString()) : null,
                productCountPerPeriod: p.jumlah_produk_per_periode ? parseFloat(p.jumlah_produk_per_periode.toString()) : null,
                productUnitPerPeriod: p.satuan_jumlah_produk_per_periode,
                idCardUrl: p.upload_ktp,
                familyCardUrl: p.upload_kartu_keluarga,
                selfPhotoUrl: p.upload_foto_diri,
                assistanceLetterUrl: p.dokumen_surat_permohonan_bantuan,
                commitmentLetterUrl: p.dokumen_surat_pernyataan_kesanggupan,
                businessProfileDocUrl: p.dokumen_profil_usaha,
                bmcStrategyDocUrl: p.dokumen_bmc_strategi_model_usaha,
                budgetPlanUrl: p.dokumen_rab,
                developmentPlanUrl: p.dokumen_rencana_pengembangan_usaha,
                businessVideoUrl: p.video_usaha,
                businessPhotoUrl: p.foto_usaha,
                financialRecordUrl: p.dokumen_pencatatan_keuangan,
            })),
            skipDuplicates: true, // Prevent error if some records already exist
        });

        return NextResponse.json({
            success: true,
            count: result.count,
        });
    } catch (error: any) {
        console.error("Import error:", error);
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
}
