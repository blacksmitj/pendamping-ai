"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCheck, UserX, MoreHorizontal, Loader2 } from "lucide-react"
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

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"

export default function UserManagementPage() {
    const queryClient = useQueryClient();

    const { data: mentors = [], isLoading } = useQuery({
        queryKey: ["users", "MENTOR"],
        queryFn: async () => {
            const res = await fetch("/api/users?role=MENTOR");
            if (!res.ok) throw new Error("Gagal mengambil data pengguna");
            return res.json();
        }
    });

    const mutation = useMutation({
        mutationFn: async ({ id, action }: { id: string, action: string }) => {
            const res = await fetch(`/api/users?id=${id}&action=${action}`, {
                method: "PATCH"
            });
            if (!res.ok) throw new Error("Gagal memperbarui pengguna");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", "MENTOR"] });
            toast.success("Status pengguna berhasil diperbarui");
        },
        onError: () => {
            toast.error("Gagal memperbarui status pengguna");
        }
    });

    const getInitials = (name: string) => {
        return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
    }

    const columns: any[] = [
        {
            header: "Pendamping",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 text-xs font-bold ring-1 ring-white">
                            {getInitials(item.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 leading-none mb-1">{item.name}</span>
                        <span className="text-xs text-slate-500 font-medium">{item.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: "ID",
            accessor: "id",
            cell: (item: any) => (
                <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">ID: {item.id.slice(0, 8)}</span>
            )
        },
        {
            header: "Tgl Daftar",
            accessor: "createdAt",
            cell: (item: any) => {
                if (!item.createdAt) return "-";
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', { weekday: 'long' })}
                        </span>
                    </div>
                )
            }
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => {
                const status = item.status
                let bgClass = ""
                let textClass = ""
                let statusLabel = ""

                switch (status) {
                    case "APPROVED":
                        bgClass = "bg-emerald-50 border-emerald-100/50"
                        textClass = "text-emerald-700"
                        statusLabel = "Aktif"
                        break
                    case "PENDING":
                        bgClass = "bg-amber-50 border-amber-100/50"
                        textClass = "text-amber-700"
                        statusLabel = "Menunggu"
                        break
                    case "REJECTED":
                        bgClass = "bg-rose-50 border-rose-100/50"
                        textClass = "text-rose-700"
                        statusLabel = "Ditolak"
                        break
                    case "SUSPENDED":
                        bgClass = "bg-slate-100 border-slate-200"
                        textClass = "text-slate-600"
                        statusLabel = "Terblokir"
                        break
                    default:
                        bgClass = "bg-slate-50 border-slate-100"
                        textClass = "text-slate-500"
                        statusLabel = status || "DRAFT"
                }

                return (
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-tight uppercase shadow-sm ${bgClass} ${textClass}`}>
                        {statusLabel}
                    </div>
                )
            }
        },
        {
            header: "Tindakan",
            id: "actions",
            cell: (item: any) => {
                const isPendingAction = mutation.isPending && mutation.variables?.id === item.id;

                return (
                    <div className="flex items-center gap-1.5">
                        {item.status === "PENDING" && (
                            <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-100/50">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 text-emerald-600 hover:bg-emerald-100/50 rounded-md font-bold text-xs"
                                    onClick={() => mutation.mutate({ id: item.id, action: 'approve' })}
                                    disabled={mutation.isPending}
                                >
                                    {isPendingAction && mutation.variables?.action === 'approve' ? (
                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                                    )}
                                    Setujui
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 text-rose-600 hover:bg-rose-100/50 rounded-md font-bold text-xs"
                                    onClick={() => mutation.mutate({ id: item.id, action: 'reject' })}
                                    disabled={mutation.isPending}
                                >
                                    {isPendingAction && mutation.variables?.action === 'reject' ? (
                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <UserX className="mr-1.5 h-3.5 w-3.5" />
                                    )}
                                    Tolak
                                </Button>
                            </div>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-600" disabled={mutation.isPending}>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-100">
                                <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Navigasi</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-lg">Lihat Profil</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-lg">Hubungi via Email</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                <DropdownMenuItem
                                    className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer px-3 py-2 rounded-lg font-medium"
                                    onClick={() => mutation.mutate({ id: item.id, action: 'suspend' })}
                                    disabled={item.status === "SUSPENDED"}
                                >
                                    Blokir Akun
                                </DropdownMenuItem>
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
                isLoading={isLoading}
            />
        </div>
    )
}
