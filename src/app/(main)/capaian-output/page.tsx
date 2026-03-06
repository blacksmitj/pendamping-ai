"use client"

import * as React from "react"
import { Plus, MoreHorizontal, FileEdit, Trash2, TrendingUp, Users2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"

type OutputReport = {
    id: string
    month: string
    participantName: string
    revenue: string
    newEmployees: string
    status: "Verified" | "Submitted" | "Draft"
}

const reports: OutputReport[] = [
    {
        id: "REP001",
        month: "Maret 2026",
        participantName: "Ahmad Rifai",
        revenue: "Rp 15.000.000",
        newEmployees: "2 orang baru",
        status: "Draft",
    },
    {
        id: "REP002",
        month: "Februari 2026",
        participantName: "Budi Santoso",
        revenue: "Rp 8.200.000",
        newEmployees: "0 orang baru",
        status: "Submitted",
    },
    {
        id: "REP003",
        month: "Februari 2026",
        participantName: "Citra Kusuma",
        revenue: "Rp 12.500.000",
        newEmployees: "1 orang baru",
        status: "Verified",
    },
]

export default function CapaianOutputPage() {
    const columns = [
        { header: "Bulan", accessor: "month" as keyof OutputReport, className: "font-medium" },
        { header: "Peserta", accessor: "participantName" as keyof OutputReport },
        {
            header: "Omzet",
            accessor: "revenue" as keyof OutputReport,
            cell: (r: OutputReport) => (
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span>{r.revenue}</span>
                </div>
            ),
        },
        {
            header: "TK Baru",
            accessor: "newEmployees" as keyof OutputReport,
            cell: (r: OutputReport) => (
                <div className="flex items-center gap-2">
                    <Users2 className="h-3 w-3 text-indigo-500" />
                    <span>{r.newEmployees}</span>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: "status" as keyof OutputReport,
            cell: (r: OutputReport) => {
                let badgeClass = ""
                let statusLabel = ""
                switch (r.status) {
                    case "Verified":
                        badgeClass = "bg-emerald-500 hover:bg-emerald-600 text-white"
                        statusLabel = "Terverifikasi"
                        break
                    case "Submitted":
                        badgeClass = "bg-slate-500 hover:bg-slate-600 text-white"
                        statusLabel = "Terkirim"
                        break
                    case "Draft":
                        badgeClass = "border-slate-300 text-slate-600"
                        statusLabel = "Draft"
                        break
                }
                return (
                    <Badge variant={r.status === "Draft" ? "outline" : "default"} className={badgeClass}>
                        {statusLabel}
                    </Badge>
                )
            },
        },
        {
            header: "Aksi",
            className: "text-right",
            cell: (r: OutputReport) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <FileEdit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    const actionButton = (
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/capaian-output/buat">
                <Plus className="mr-2 h-4 w-4" /> Buat Laporan Baru
            </Link>
        </Button>
    )

    const filters = (
        <>
            <Button variant="outline">Filter Bulan</Button>
            <Button variant="outline">Filter Status</Button>
        </>
    )

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Capaian Output"
                description="Laporan capaian bulanan (omzet, volume transaksi, tenaga kerja baru)."
                action={actionButton}
            />

            <DataTable
                columns={columns}
                data={reports}
                searchPlaceholder="Cari nama peserta atau bulan..."
                filters={filters}
            />
        </div>
    )
}
