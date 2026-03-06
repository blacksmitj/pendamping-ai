"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Users,
    BookOpen,
    TrendingUp,
    AlertCircle,
    MessageSquare,
    ArrowLeft,
    Clock,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"

const universityData = {
    id: "UNIV-01",
    name: "Universitas Indonesia",
    location: "Depok, Jawa Barat",
    stats: {
        totalMentors: 12,
        totalParticipants: 145,
        completedLogbooks: 450,
        pendingReviews: 8,
        growthAvg: 12.5
    },
    recentMentors: [
        { id: "M001", name: "Dr. Budi Santoso", participants: 12, logbooks: 45, status: "Aktif" },
        { id: "M002", name: "Sari Wijaya, M.M.", participants: 10, logbooks: 38, status: "Aktif" },
        { id: "M003", name: "Hendra Pratama", participants: 15, logbooks: 52, status: "Aktif" },
        { id: "M004", name: "Rina Amalia", participants: 8, logbooks: 20, status: "Cuti" },
    ]
}

export default function UniversityDetailPage() {
    const params = useParams()

    const columns: any[] = [
        {
            header: "Nama Mentor",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500">ID: {item.id}</span>
                </div>
            )
        },
        {
            header: "Jml Peserta",
            accessor: "participants",
            cell: (item: any) => (
                <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.participants}</span>
                </div>
            )
        },
        {
            header: "Logbook",
            accessor: "logbooks",
            cell: (item: any) => (
                <div className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.logbooks}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => (
                <Badge variant={item.status === "Aktif" ? "default" : "secondary"} className={item.status === "Aktif" ? "bg-emerald-500" : ""}>
                    {item.status}
                </Badge>
            )
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-indigo-600">Lihat Laporan</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                    <Link href="/pengawas/universitas">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{universityData.name}</h1>
                    <p className="text-sm text-slate-500">{universityData.location}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none bg-indigo-50 shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-600 font-medium">Total Peserta</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-indigo-900">{universityData.stats.totalParticipants}</span>
                            <span className="text-xs text-indigo-500 mb-1 flex items-center gap-0.5">
                                <Users className="h-3 w-3" /> Aktif
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-emerald-50 shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-600 font-medium">Logbook Diterima</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-emerald-900">{universityData.stats.completedLogbooks}</span>
                            <span className="text-xs text-emerald-500 mb-1 flex items-center gap-0.5">
                                <CheckCircle2 className="h-3 w-3" /> Terverifikasi
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-amber-50 shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-amber-600 font-medium">Menunggu Review</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-amber-900">{universityData.stats.pendingReviews}</span>
                            <span className="text-xs text-amber-500 mb-1 flex items-center gap-0.5">
                                <Clock className="h-3 w-3" /> Antrian
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-slate-100 shadow-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-600 font-medium">Rata-rata Pertumbuhan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">+{universityData.stats.growthAvg}%</span>
                            <span className="text-xs text-emerald-600 mb-1 flex items-center gap-0.5">
                                <TrendingUp className="h-3 w-3" /> Positif
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Daftar Pendamping (Mentor)</CardTitle>
                            <CardDescription>Manajemen dan monitor performa pendamping di universitas ini.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={universityData.recentMentors}
                                searchPlaceholder="Cari mentor..."
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                Butuh Perhatian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border p-3 bg-rose-50 border-rose-100">
                                <p className="text-xs font-semibold text-rose-700">Laporan Telat (3)</p>
                                <p className="text-xs text-rose-600 mt-1">Hendra Pratama belum mengunggah logbook untuk 2 hari terakhir.</p>
                                <Button variant="link" className="p-0 h-auto text-[10px] text-rose-700 font-bold mt-2">Kirim Pengingat</Button>
                            </div>
                            <div className="rounded-lg border p-3 bg-amber-50 border-amber-100">
                                <p className="text-xs font-semibold text-amber-700">Revisi Ditolak (1)</p>
                                <p className="text-xs text-amber-600 mt-1">Sari Wijaya menyatakan revisi tidak dapat dilakukan karena kendala lapangan.</p>
                                <Button variant="link" className="p-0 h-auto text-[10px] text-amber-700 font-bold mt-2">Lihat Alasan</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-indigo-600" />
                                Pesan ke Admin
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea placeholder="Kirim pesan instruksi atau feedback ke Admin Universitas ini..." className="min-h-[100px]" />
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Kirim Pesan</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
