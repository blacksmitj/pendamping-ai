"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Eye, MessageSquare, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const capaianData = [
    {
        id: "MON-CAP-001",
        university: "Universitas Indonesia",
        participant: "Ahmad Rifai",
        growth: 12.5,
        newJobs: 2,
        status: "Lengkap",
    },
    {
        id: "MON-CAP-002",
        university: "IPB University",
        participant: "Budi Santoso",
        growth: -5.2,
        newJobs: 0,
        status: "Belum Lengkap",
    },
    {
        id: "MON-CAP-003",
        university: "Universitas Padjadjaran",
        participant: "Citra Lestari",
        growth: 8.7,
        newJobs: 1,
        status: "Lengkap",
    },
]

export default function PengawasCapaianPage() {
    const columns: any[] = [
        {
            header: "Peserta",
            accessor: "participant",
            cell: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{item.participant}</span>
                    <span className="text-xs text-slate-500">{item.university}</span>
                </div>
            )
        },
        {
            header: "Pertumbuhan Omzet",
            accessor: "growth",
            cell: (item: any) => (
                <div className={`flex items-center gap-1 font-medium ${item.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                </div>
            )
        },
        {
            header: "Tenaga Kerja Baru",
            accessor: "newJobs",
            cell: (item: any) => (
                <div className="font-medium">
                    {item.newJobs} Orang
                </div>
            )
        },
        {
            header: "Status Data",
            accessor: "status",
            cell: (item: any) => (
                <Badge variant={item.status === 'Lengkap' ? 'default' : 'secondary'} className={item.status === 'Lengkap' ? 'bg-emerald-500' : ''}>
                    {item.status}
                </Badge>
            )
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <PageHeader
                    title="Rekapitulasi Capaian"
                    description="Pantau pertumbuhan bisnis (omzet & tenaga kerja) seluruh peserta dampingan."
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="mr-2 h-4 w-4" /> Email Rekap ZIP
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none bg-slate-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500">Rata-rata Pertumbuhan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-emerald-600">+8.4%</p>
                    </CardContent>
                </Card>
                <Card className="border-none bg-slate-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500">Total Tenaga Kerja Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-slate-900">124 Orang</p>
                    </CardContent>
                </Card>
                <Card className="border-none bg-slate-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500">Kelengkapan Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-amber-600">72%</p>
                    </CardContent>
                </Card>
                <Card className="border-none bg-slate-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500">Peserta Drop</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-rose-600">14</p>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                columns={columns}
                data={capaianData}
                searchPlaceholder="Cari peserta atau universitas..."
            />
        </div>
    )
}
