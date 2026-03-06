"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Users, BookOpen, MessageCircle, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const universities = [
    {
        id: "UNIV-01",
        name: "Universitas Indonesia",
        location: "Depok, Jawa Barat",
        mentors: 12,
        participants: 145,
        pendingReviews: 8,
        status: "Aktif",
    },
    {
        id: "UNIV-02",
        name: "IPB University",
        location: "Bogor, Jawa Barat",
        mentors: 8,
        participants: 92,
        pendingReviews: 3,
        status: "Aktif",
    },
    {
        id: "UNIV-03",
        name: "Universitas Padjadjaran",
        location: "Sumedang, Jawa Barat",
        mentors: 15,
        participants: 180,
        pendingReviews: 12,
        status: "Aktif",
    },
]

export default function PengawasUniversitasPage() {
    const columns: any[] = [
        {
            header: "Universitas",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{item.name}</span>
                        <span className="text-xs text-slate-500">{item.location}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Peserta",
            accessor: "participants",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>{item.participants} Orang</span>
                </div>
            )
        },
        {
            header: "Pendamping",
            accessor: "mentors",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span>{item.mentors} Mentor</span>
                </div>
            )
        },
        {
            header: "Pending Review",
            accessor: "pendingReviews",
            cell: (item: any) => (
                <Badge
                    variant={item.pendingReviews > 5 ? "destructive" : "secondary"}
                    className={item.pendingReviews > 5 ? "bg-rose-500" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}
                >
                    {item.pendingReviews} Laporan
                </Badge>
            )
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                        Detail <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                        <MessageCircle className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Daftar Universitas"
                description="Monitor daftar universitas yang berada di bawah pengawasan Anda."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-indigo-600 border-none">
                    <CardContent className="pt-6 text-white">
                        <p className="text-indigo-100 text-sm font-medium">Total Universitas</p>
                        <p className="text-3xl font-bold">3</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-slate-500 text-sm font-medium">Total Peserta Terpantau</p>
                        <p className="text-3xl font-bold text-slate-900">417</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardContent className="pt-6">
                        <p className="text-slate-500 text-sm font-medium">Butuh Tindak Lanjut</p>
                        <p className="text-3xl font-bold text-rose-600">23</p>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                columns={columns}
                data={universities}
                searchPlaceholder="Cari universitas atau lokasi..."
            />
        </div>
    )
}
