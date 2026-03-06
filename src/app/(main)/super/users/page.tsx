"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCheck, UserX, ShieldCheck, ShieldAlert, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const superUsers = [
    {
        id: "SU-001",
        name: "Budi Pratama",
        email: "budi.admin@ui.ac.id",
        university: "Universitas Indonesia",
        role: "Admin Univ",
        status: "Pending",
        registeredAt: "2026-03-05",
    },
    {
        id: "SU-002",
        name: "Siska Amelia",
        email: "siska.pengawas@gov.id",
        university: "Pusat",
        role: "Pengawas",
        status: "Aktif",
        registeredAt: "2026-03-01",
    },
    {
        id: "SU-003",
        name: "Hendi Suhendi",
        email: "hendi@itb.ac.id",
        university: "ITB",
        role: "Admin Univ",
        status: "Pending",
        registeredAt: "2026-03-04",
    },
]

export default function SuperUsersPage() {
    const columns: any[] = [
        {
            header: "User",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.email}</span>
                </div>
            )
        },
        {
            header: "Instansi",
            accessor: "university",
        },
        {
            header: "Role",
            accessor: "role",
            cell: (item: any) => (
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    {item.role === 'Admin Univ' ? <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" /> : <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />}
                    {item.role}
                </div>
            )
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => (
                <Badge variant={item.status === "Aktif" ? "default" : "secondary"} className={item.status === "Aktif" ? "bg-emerald-500" : "bg-amber-500 text-white border-none"}>
                    {item.status}
                </Badge>
            )
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    {item.status === "Pending" && (
                        <>
                            <Button size="sm" variant="outline" className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                                <UserCheck className="h-3.5 w-3.5 mr-1" />
                                Setujui
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50">
                                <UserX className="h-3.5 w-3.5 mr-1" />
                                Tolak
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-rose-600">Nonaktifkan</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Persetujuan User"
                description="Verifikasi akun Admin Universitas dan Pengawas yang baru mendaftar."
            />

            <DataTable
                columns={columns}
                data={superUsers}
                searchPlaceholder="Cari nama, email, atau instansi..."
            />
        </div>
    )
}
