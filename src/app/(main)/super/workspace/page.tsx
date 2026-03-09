"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Briefcase, ChevronRight, Settings2, FileUp, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImportSheet } from "@/components/participants/import-sheet"
import { WorkspaceSheet } from "@/components/super/workspace-sheet"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"

export default function SuperWorkspacePage() {
    const [importOpen, setImportOpen] = React.useState(false)
    const [workspaceSheetOpen, setWorkspaceSheetOpen] = React.useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = React.useState<any | null>(null)
    const [editWorkspace, setEditWorkspace] = React.useState<any | null>(null)

    const { data: workspaces, isLoading, refetch } = useQuery({
        queryKey: queryKeys.workspaces.all,
        queryFn: async () => {
            const res = await fetch("/api/workspaces")
            if (!res.ok) throw new Error("Failed to fetch workspaces")
            return res.json()
        },
    })

    const handleOpenImport = (workspace: any) => {
        setSelectedWorkspace(workspace)
        setImportOpen(true)
    }

    const handleCreateNew = () => {
        setEditWorkspace(null)
        setWorkspaceSheetOpen(true)
    }

    const handleEdit = (workspace: any) => {
        setEditWorkspace(workspace)
        setWorkspaceSheetOpen(true)
    }

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
                    <span>{new Date(item.startDate).toLocaleDateString('id-ID')} - {new Date(item.endDate).toLocaleDateString('id-ID')}</span>
                </div>
            )
        },
        {
            header: "Statistik",
            accessor: "participants",
            cell: (item: any) => (
                <div className="text-xs space-y-1">
                    <p><span className="font-semibold">{item._count?.universities || 0}</span> Universitas</p>
                    <p><span className="font-semibold">{item._count?.participants || 0}</span> Peserta</p>
                </div>
            )
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => {
                const statusLabel = item.status === "ACTIVE" ? "Aktif" : item.status === "COMPLETED" ? "Selesai" : "Arsip";
                const variant = item.status === "ACTIVE" ? "default" : "secondary";
                const className = item.status === "ACTIVE" ? "bg-emerald-500" : "";

                return (
                    <Badge variant={variant} className={className}>
                        {statusLabel}
                    </Badge>
                )
            }
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => handleOpenImport(item)}>
                        Import Excel <FileUp className="ml-1 h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8" onClick={() => handleEdit(item)}>
                        Edit <Edit className="ml-1 h-3.5 w-3.5" />
                    </Button>
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
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreateNew}>
                    <Plus className="mr-2 h-4 w-4" /> Workspace Baru
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={workspaces || []}
                isLoading={isLoading}
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

            {selectedWorkspace && (
                <ImportSheet
                    open={importOpen}
                    onOpenChange={setImportOpen}
                    workspaceId={selectedWorkspace.id}
                    workspaceName={selectedWorkspace.name}
                    onSuccess={() => refetch()}
                />
            )}

            <WorkspaceSheet
                open={workspaceSheetOpen}
                onOpenChange={(open) => {
                    setWorkspaceSheetOpen(open)
                    if (!open) refetch()
                }}
                workspace={editWorkspace}
            />
        </div>
    )
}
