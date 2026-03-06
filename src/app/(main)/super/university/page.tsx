"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Globe, MoreHorizontal, Trash2, Edit } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUniversities, deleteUniversity } from "@/actions/university"
import { getWorkspaces } from "@/actions/workspaces"
import { UniversityDialog } from "./university-dialog"
import { toast } from "sonner"
import Image from "next/image"
import { getStorageUrl } from "@/lib/storage-helper"

export default function SuperUniversitasPage() {
    const [universities, setUniversities] = React.useState<any[]>([])
    const [workspaces, setWorkspaces] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [selectedUniversity, setSelectedUniversity] = React.useState<any>(null)

    const fetchData = React.useCallback(async () => {
        setLoading(true)
        try {
            const [univData, wsData] = await Promise.all([
                getUniversities(),
                getWorkspaces()
            ])
            setUniversities(univData)
            setWorkspaces(wsData)
        } catch (error) {
            toast.error("Gagal mengambil data")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus universitas ini?")) return
        try {
            const res = await deleteUniversity(id)
            if (res.success) {
                toast.success("Universitas berhasil dihapus")
                fetchData()
            } else {
                toast.error(res.error || "Gagal menghapus")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan")
        }
    }

    const columns: any[] = [
        {
            header: "Universitas",
            accessor: "name",
            cell: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.logoUrl ? (
                            <Image src={getStorageUrl(item.logoUrl)} alt={item.name} width={40} height={40} className="object-contain" />
                        ) : (
                            <Building2 className="h-5 w-5 text-slate-400" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{item.name}</span>
                        <span className="text-xs text-slate-500">{item.code}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Wilayah",
            accessor: "city",
            cell: (item: any) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.city}, {item.province}</span>
                </div>
            )
        },
        {
            header: "Mentors",
            accessor: "_count.users",
            cell: (item: any) => (
                <Badge variant="outline" className="font-normal">
                    {item._count?.users || 0} Mentors
                </Badge>
            )
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => (
                <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"} className={item.status === "ACTIVE" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-500"}>
                    {item.status === "ACTIVE" ? "Terverifikasi" : "Pending"}
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
                        <DropdownMenuItem onClick={() => {
                            setSelectedUniversity(item)
                            setDialogOpen(true)
                        }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus Universitas
                        </DropdownMenuItem>
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
                <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                        setSelectedUniversity(null)
                        setDialogOpen(true)
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" /> Tambah Universitas
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={universities}
                isLoading={loading}
                searchPlaceholder="Cari universitas atau wilayah..."
            />

            <UniversityDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                university={selectedUniversity}
                workspaces={workspaces}
                onSuccess={fetchData}
            />
        </div>
    )
}
