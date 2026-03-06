"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Edit3, Eye, FileText, CheckCircle, AlertCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
} from "@/components/ui/card"

const monthlyReports = [
    {
        id: "OUT-2026-02-001",
        month: "Februari 2026",
        mentor: "Dr. Budi Santoso",
        participant: "Ahmad Rifai",
        status: "Pending",
    },
    {
        id: "OUT-2026-02-002",
        month: "Februari 2026",
        mentor: "Sari Wijaya, M.M.",
        participant: "Budi Santoso",
        status: "Disetujui",
    },
    {
        id: "OUT-2026-02-003",
        month: "Februari 2026",
        mentor: "Dr. Budi Santoso",
        participant: "Citra Lestari",
        status: "Perlu Revisi",
    },
]

export default function CapaianReviewPage() {
    const columns: any[] = [
        {
            header: "ID",
            accessor: "id",
        },
        {
            header: "Bulan",
            accessor: "month",
        },
        {
            header: "Pendamping",
            accessor: "mentor",
        },
        {
            header: "Peserta",
            accessor: "participant",
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => {
                const status = item.status
                const variants: any = {
                    "Pending": "secondary",
                    "Disetujui": "default",
                    "Perlu Revisi": "destructive",
                }
                const colors: any = {
                    "Pending": "bg-slate-500 hover:bg-slate-600 text-white border-none",
                    "Disetujui": "bg-emerald-500 hover:bg-emerald-600 text-white border-none",
                    "Perlu Revisi": "bg-amber-500 hover:bg-amber-600 text-white border-none",
                }
                return (
                    <Badge variant={variants[status]} className={colors[status]}>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700">
                            <Eye className="h-4 w-4" />
                        </Button>

                        {item.status === "Pending" && (
                            <>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700">
                                    <Check className="h-4 w-4" />
                                </Button>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700">
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Minta Revisi Capaian Output</DialogTitle>
                                            <DialogDescription>
                                                Berikan catatan detail bagian mana yang perlu diperbaiki oleh pendamping pada laporan bulanan ini.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="note">Catatan Revisi</Label>
                                                <Textarea
                                                    id="note"
                                                    placeholder="Contoh: Lampiran bukti transaksi belum lengkap, mohon diunggah kembali."
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline">Batal</Button>
                                            <Button className="bg-amber-600 hover:bg-amber-700">Kirim Revisi</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                    </div>
                )
            }
        }
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Review Capaian Output"
                description="Validasi dan tinjau laporan capaian bulanan (omzet, tenaga kerja, dsb) dari peserta."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-50 border-none shadow-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-200 rounded-lg">
                                <FileText className="h-5 w-5 text-slate-700" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Menunggu Review</p>
                                <p className="text-2xl font-bold text-slate-900">5</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-none shadow-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-emerald-200 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-emerald-700" />
                            </div>
                            <div>
                                <p className="text-sm text-emerald-500">Disetujui Bulan Ini</p>
                                <p className="text-2xl font-bold text-emerald-900">42</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-none shadow-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-amber-200 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-amber-700" />
                            </div>
                            <div>
                                <p className="text-sm text-amber-500">Perlu Revisi</p>
                                <p className="text-2xl font-bold text-amber-900">3</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                columns={columns}
                data={monthlyReports}
                searchPlaceholder="Cari ID, pendamping, atau peserta..."
            />
        </div>
    )
}
