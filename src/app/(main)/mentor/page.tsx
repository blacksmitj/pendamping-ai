"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, GraduationCap, MapPin, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MentorListPage() {
    const { data: mentors = [], isLoading } = useQuery({
        queryKey: ["mentors"],
        queryFn: async () => {
            const res = await fetch("/api/users?role=MENTOR");
            if (!res.ok) throw new Error("Gagal mengambil data mentor");
            return res.json();
        }
    });

    const columns: any[] = [
        {
            header: "Mentor",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-indigo-100">
                        <AvatarImage src={item.image} />
                        <AvatarFallback className="bg-indigo-50 text-indigo-700">
                            {item.name?.slice(0, 2).toUpperCase() || "M"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                        <span className="font-semibold text-slate-900 line-clamp-1">{item.name}</span>
                        <span className="text-xs text-slate-500 line-clamp-1">{item.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Universitas",
            accessor: "university.name",
            cell: (item: any) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span className="text-sm line-clamp-1">{item.university?.name || "-"}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => {
                const status = item.status
                return (
                    <Badge
                        variant={
                            status === "APPROVED" ? "default" :
                                status === "PENDING" ? "secondary" :
                                    status === "REJECTED" ? "destructive" : "outline"
                        }
                        className={
                            status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200" :
                                status === "PENDING" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200" : ""
                        }
                    >
                        {status}
                    </Badge>
                )
            }
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => (
                <div className="flex items-center justify-end">
                    <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
                        <Link href={`/mentor/${item.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                        </Link>
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Daftar Mentor"
                description="Lihat dan kelola semua mentor yang terdaftar dalam sistem."
            />

            <div className="grid gap-6">
                <DataTable
                    columns={columns}
                    data={mentors}
                    searchPlaceholder="Cari mentor berdasarkan nama atau email..."
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}
