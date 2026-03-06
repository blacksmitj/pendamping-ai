"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Search, Globe, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const suniversities = [
    {
        id: "UNIV-S-01",
        name: "Universitas Indonesia",
        code: "UI",
        region: "Jawa Barat",
        admin: "Admin UI",
        status: "Terverifikasi",
    },
    {
        id: "UNIV-S-02",
        name: "Universitas Gadjah Mada",
        code: "UGM",
        region: "DI Yogyakarta",
        admin: "Admin UGM",
        status: "Terverifikasi",
    },
    {
        id: "UNIV-S-03",
        name: "Institut Teknologi Bandung",
        code: "ITB",
        region: "Jawa Barat",
        admin: "Admin ITB",
        status: "Pending",
    },
]

export default function SuperUniversitasPage() {
    const columns: any[] = [
        {
            header: "Universitas",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.code}</span>
                </div>
            )
        },
        {
            header: "Wilayah",
            accessor: "region",
            cell: (item: any) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.region}</span>
                </div>
            )
        },
        {
            header: "Admin Utama",
            accessor: "admin",
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => (
                <Badge variant={item.status === "Terverifikasi" ? "default" : "secondary"} className={item.status === "Terverifikasi" ? "bg-emerald-500" : "bg-amber-500 text-white"}>
                    {item.status}
                </Badge>
            )
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Edit Data</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600">Hapus Universitas</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <PageHeader
                    title="Manajemen Universitas"
                    description="Daftarkan dan kelola mitra universitas pelaksana program Pendampingan."
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Universitas
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={suniversities}
                searchPlaceholder="Cari universitas atau wilayah..."
            />
        </div>
    )
}
