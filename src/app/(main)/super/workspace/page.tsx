"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Briefcase, ChevronRight, Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const workspaces = [
    {
        id: "WS-2025-01",
        name: "TKM Lanjutan 2025",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: "Aktif",
        universities: 12,
        participants: 9000,
    },
    {
        id: "WS-2024-01",
        name: "TKM Lanjutan 2024",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: "Selesai",
        universities: 10,
        participants: 8500,
    },
]

export default function SuperWorkspacePage() {
    const columns: any[] = [
        {
            header: "Nama Workspace",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{item.name}</span>
                        <span className="text-xs text-slate-500">ID: {item.id}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Periode",
            accessor: "startDate",
            cell: (item: any) => (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{item.startDate} - {item.endDate}</span>
                </div>
            )
        },
        {
            header: "Statistik",
            accessor: "participants",
            cell: (item: any) => (
                <div className="text-xs space-y-1">
                    <p><span className="font-semibold">{item.universities}</span> Universitas</p>
                    <p><span className="font-semibold">{item.participants}</span> Peserta</p>
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
                    <Button variant="outline" size="sm" className="h-8">
                        Kelola <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <Settings2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <PageHeader
                    title="Manajemen Workspace"
                    description="Buat dan kelola event tahunan (workspace) untuk program Pendampingan TKM."
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Workspace Baru
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={workspaces}
                searchPlaceholder="Cari nama workspace..."
            />

            <Card className="bg-amber-50 border-amber-100 shadow-none">
                <CardHeader>
                    <CardTitle className="text-amber-800 text-sm flex items-center gap-2">
                        <Settings2 className="h-4 w-4" />
                        Tips Workspace
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        Workspace digunakan untuk memisahkan data antar periode event. Pastikan untuk menutup workspace lama (Selesai) sebelum membuka workspace baru untuk menghindari duplikasi data pendampingan.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
