"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCheck, UserX, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mentors = [
    {
        id: "M001",
        name: "Dr. Budi Santoso",
        email: "budi@univ.ac.id",
        university: "Universitas Indonesia",
        status: "Aktif",
        registeredAt: "2026-03-01",
    },
    {
        id: "M002",
        name: "Sari Wijaya, M.M.",
        email: "sari@univ.ac.id",
        university: "Universitas Indonesia",
        status: "Pending",
        registeredAt: "2026-03-04",
    },
    {
        id: "M003",
        name: "Hendra Pratama",
        email: "hendra@univ.ac.id",
        university: "Universitas Indonesia",
        status: "Aktif",
        registeredAt: "2026-02-15",
    },
]

export default function UserManagementPage() {
    const columns: any[] = [
        {
            header: "Pendamping",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.email}</span>
                </div>
            )
        },
        {
            header: "ID",
            accessor: "id",
        },
        {
            header: "Tgl Daftar",
            accessor: "registeredAt",
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => {
                const status = item.status
                return (
                    <Badge
                        variant={status === "Aktif" ? "default" : "secondary"}
                        className={status === "Aktif" ? "bg-emerald-500 hover:bg-emerald-600 border-none" : "bg-amber-500 hover:bg-amber-600 text-white border-none"}
                    >
                        {status}
                    </Badge>
                )
            }
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => {
                return (
                    <div className="flex items-center gap-2">
                        {item.status === "Pending" && (
                            <>
                                <Button size="sm" variant="outline" className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                                    <UserCheck className="mr-1 h-3.5 w-3.5" /> Setujui
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                                    <UserX className="mr-1 h-3.5 w-3.5" /> Tolak
                                </Button>
                            </>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem>Lihat Profil</DropdownMenuItem>
                                <DropdownMenuItem>Hubungi via Email</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-rose-600">Blokir Akun</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manajemen User"
                description="Kelola dan verifikasi akun pendamping di universitas Anda."
            />

            <DataTable
                columns={columns}
                data={mentors}
                searchPlaceholder="Cari nama atau email..."
            />
        </div>
    )
}
