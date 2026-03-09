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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function SuperUsersPage() {
    const queryClient = useQueryClient();

    const { data: superUsers, isLoading } = useQuery({
        queryKey: ["super-users"],
        queryFn: async () => {
            const res = await fetch("/api/users?role=UNIVERSITY_ADMIN&role=UNIVERSITY_SUPERVISOR")
            if (!res.ok) throw new Error("Gagal mengambil data user")
            const users = await res.json()
            return users.map((u: any) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                university: u.university?.name || "Belum Terhubung",
                role: u.role === "UNIVERSITY_ADMIN" ? "Admin Univ" : "Pengawas",
                status: u.status === "PENDING" ? "Pending" : u.status === "APPROVED" ? "Aktif" : u.status === "REJECTED" ? "Ditolak" : "Nonaktif",
                registeredAt: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "-",
                originalStatus: u.status,
            }))
        },
    });

    const approveMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/users?id=${id}&action=approve`, { method: "PATCH" })
            if (!res.ok) throw new Error("Gagal menyetujui user")
            return res.json()
        },
        onSuccess: () => {
            toast.success("User berhasil disetujui");
            queryClient.invalidateQueries({ queryKey: ["super-users"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Gagal menyetujui user");
        }
    });

    const rejectMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/users?id=${id}&action=reject`, { method: "PATCH" })
            if (!res.ok) throw new Error("Gagal menolak user")
            return res.json()
        },
        onSuccess: () => {
            toast.success("User berhasil ditolak");
            queryClient.invalidateQueries({ queryKey: ["super-users"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Gagal menonolak user");
        }
    });

    const suspendMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/users?id=${id}&action=suspend`, { method: "PATCH" })
            if (!res.ok) throw new Error("Gagal menonaktifkan user")
            return res.json()
        },
        onSuccess: () => {
            toast.success("User berhasil dinonaktifkan");
            queryClient.invalidateQueries({ queryKey: ["super-users"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Gagal menonaktifkan user");
        }
    });
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
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                onClick={() => approveMutation.mutate(item.id)}
                                disabled={approveMutation.isPending}
                            >
                                <UserCheck className="h-3.5 w-3.5 mr-1" />
                                Setujui
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50"
                                onClick={() => rejectMutation.mutate(item.id)}
                                disabled={rejectMutation.isPending}
                            >
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
                            {item.originalStatus !== "SUSPENDED" && item.originalStatus !== "REJECTED" && (
                                <DropdownMenuItem
                                    className="text-rose-600"
                                    onClick={() => suspendMutation.mutate(item.id)}
                                    disabled={suspendMutation.isPending}
                                >
                                    Nonaktifkan
                                </DropdownMenuItem>
                            )}
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
                data={superUsers || []}
                searchPlaceholder="Cari nama, email, atau instansi..."
                isLoading={isLoading}
            />
        </div>
    )
}
