"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageSquare, Search, Filter } from "lucide-react"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

const monitorLogbooks = [
    {
        id: "LGB-P-001",
        university: "Universitas Indonesia",
        mentor: "Dr. Budi Santoso",
        participant: "Ahmad Rifai",
        date: "2026-03-05",
        status: "Disetujui Admin",
    },
    {
        id: "LGB-P-002",
        university: "IPB University",
        mentor: "Sari Wijaya, M.M.",
        participant: "Budi Santoso",
        date: "2026-03-04",
        status: "Menunggu Review",
    },
    {
        id: "LGB-P-003",
        university: "Universitas Padjadjaran",
        mentor: "Hendra Pratama",
        participant: "Citra Lestari",
        date: "2026-03-03",
        status: "Perlu Revisi",
    },
]

export default function PengawasLogbookPage() {
    const columns: any[] = [
        {
            header: "ID",
            accessor: "id",
        },
        {
            header: "Universitas",
            accessor: "university",
        },
        {
            header: "Mentor",
            accessor: "mentor",
        },
        {
            header: "Tanggal",
            accessor: "date",
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => {
                const status = item.status
                const colors: any = {
                    "Disetujui Admin": "bg-emerald-500 text-white border-none",
                    "Menunggu Review": "bg-slate-500 text-white border-none",
                    "Perlu Revisi": "bg-amber-500 text-white border-none",
                }
                return (
                    <Badge className={colors[status] || "bg-slate-200 text-slate-700"}>
                        {status}
                    </Badge>
                )
            }
        },
        {
            header: "Aksi",
            id: "actions",
            cell: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Pesan Monitor - {item.university}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <ScrollArea className="h-[200px] border rounded-lg p-4 bg-slate-50">
                                    <div className="space-y-3">
                                        <div className="flex flex-col gap-1">
                                            <div className="rounded-lg bg-indigo-600 text-white p-2 text-sm self-start max-w-[80%]">
                                                Mohon pastikan dokumentasi kegiatan dilampirkan dengan jelas.
                                            </div>
                                            <span className="text-[10px] text-slate-500">Pengawas • 10:30</span>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end">
                                            <div className="rounded-lg bg-white border p-2 text-sm max-w-[80%]">
                                                Baik pak, sudah kami ingatkan ke mentor yang bersangkutan.
                                            </div>
                                            <span className="text-[10px] text-slate-500">Admin UI • 11:15</span>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Kirim Pesan Baru</Label>
                                    <Textarea id="message" placeholder="Ketik pesan untuk Admin Universitas..." />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button className="bg-indigo-600 hover:bg-indigo-700">Kirim Pesan</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Monitoring Logbook"
                description="Pantau seluruh aktivitas harian pendamping dari berbagai universitas."
            />

            <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter Universitas
                </Button>
                <Button variant="outline" className="gap-2">
                    <Search className="h-4 w-4" /> Cari Mentor/Peserta
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={monitorLogbooks}
                searchPlaceholder="Cari berdasarkan ID atau mentor..."
            />
        </div>
    )
}
