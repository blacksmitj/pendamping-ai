"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Eye, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"

export default function CapaianReviewPage() {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [revisionNote, setRevisionNote] = React.useState("")
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [selectedReportId, setSelectedReportId] = React.useState<string | null>(null)

    const { data: reports = [], isLoading } = useQuery({
        queryKey: ["admin", "outputs"],
        queryFn: async () => {
            const res = await fetch("/api/outputs")
            if (!res.ok) throw new Error("Gagal mengambil data output")
            return res.json()
        }
    })

    const reviewMutation = useMutation({
        mutationFn: async ({ id, action, note }: { id: string, action: string, note?: string }) => {
            const res = await fetch(`/api/outputs?id=${id}&action=${action}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note })
            })
            if (!res.ok) throw new Error("Gagal melakukan review")
            return res.text()
        },
        onSuccess: () => {
            toast.success("Review berhasil disimpan")
            queryClient.invalidateQueries({ queryKey: ["admin", "outputs"] })
            setIsSheetOpen(false)
            setRevisionNote("")
        },
        onError: (err: any) => {
            toast.error(err?.message || "Terjadi kesalahan")
        }
    })

    const handleApprove = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menyetujui laporan ini?")) {
            reviewMutation.mutate({ id, action: "approved" })
        }
    }

    const handleRevision = () => {
        if (!selectedReportId || !revisionNote) {
            toast.error("Catatan revisi wajib diisi")
            return
        }
        reviewMutation.mutate({ id: selectedReportId, action: "revision", note: revisionNote })
    }

    const stats = React.useMemo(() => {
        const pending = reports.filter((r: any) => r.reviewStatus === "SUBMITTED").length
        const approved = reports.filter((r: any) => r.reviewStatus === "APPROVED").length
        const revision = reports.filter((r: any) => r.reviewStatus === "REVISION").length
        return { pending, approved, revision }
    }, [reports])

    const getInitials = (name: string) => {
        return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
    }

    const columns: any[] = [
        {
            header: "Bulan",
            accessor: "reportMonth",
            cell: (r: any) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 capitalize">
                        {new Date(r.reportMonth).toLocaleDateString('id-ID', { month: 'long' })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">
                        {new Date(r.reportMonth).getFullYear()} • ID: {r.id.substring(0, 6)}
                    </span>
                </div>
            )
        },
        {
            header: "Peserta",
            accessor: "participant",
            cell: (r: any) => {
                const name = r.participant?.fullName || "No Name"
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 text-xs font-bold ring-1 ring-white">
                                {getInitials(name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 leading-none mb-1">{name}</span>
                            <span className="text-xs text-slate-500 font-medium">{r.participant?.businessSector || "-"}</span>
                        </div>
                    </div>
                )
            }
        },
        {
            header: "Pendamping",
            accessor: "mentor",
            cell: (r: any) => {
                const mentorName = r.participant?.assignments?.[0]?.mentor?.name || "-"
                return (
                    <div className="flex items-center gap-2 max-w-[180px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-700 truncate">{mentorName}</span>
                    </div>
                )
            }
        },
        {
            header: "Status",
            accessor: "reviewStatus",
            cell: (item: any) => {
                const status = item.reviewStatus
                let bgClass = ""
                let textClass = ""
                let statusLabel = ""
                let Icon = CheckCircle

                switch (status) {
                    case "APPROVED":
                        bgClass = "bg-emerald-50 border-emerald-100/50"
                        textClass = "text-emerald-700"
                        statusLabel = "Disetujui"
                        Icon = CheckCircle
                        break
                    case "SUBMITTED":
                        bgClass = "bg-blue-50 border-blue-100/50"
                        textClass = "text-blue-700"
                        statusLabel = "Pending"
                        Icon = Loader2
                        break
                    case "REVISION":
                        bgClass = "bg-amber-50 border-amber-100/50"
                        textClass = "text-amber-700"
                        statusLabel = "Revisi"
                        Icon = AlertCircle
                        break
                    case "REJECTED":
                        bgClass = "bg-rose-50 border-rose-100/50"
                        textClass = "text-rose-700"
                        statusLabel = "Ditolak"
                        Icon = AlertCircle
                        break
                    default:
                        bgClass = "bg-slate-50 border-slate-100/50"
                        textClass = "text-slate-600"
                        statusLabel = status || "DRAFT"
                        Icon = FileText
                }

                return (
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold tracking-tight shadow-sm ${bgClass} ${textClass}`}>
                        <Icon className={`h-3 w-3 ${status === "SUBMITTED" ? "animate-spin" : ""}`} />
                        {statusLabel}
                    </div>
                )
            }
        },
        {
            header: "Tindakan",
            id: "actions",
            cell: (item: any) => {
                return (
                    <div className="flex items-center gap-1 group-hover:bg-slate-50/50 rounded-lg p-0.5 transition-colors">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            onClick={() => router.push(`/output/${item.id}`)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>

                        {item.reviewStatus === "SUBMITTED" && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    onClick={() => handleApprove(item.id)}
                                    disabled={reviewMutation.isPending}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>

                                <Sheet open={isSheetOpen && selectedReportId === item.id} onOpenChange={(open) => {
                                    setIsSheetOpen(open)
                                    if (open) setSelectedReportId(item.id)
                                }}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                            <AlertCircle className="h-4 w-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="sm:max-w-[425px] w-full p-0 flex flex-col">
                                        <SheetHeader className="p-6 border-b bg-slate-50/50">
                                            <SheetTitle className="text-xl font-bold text-slate-900">Minta Revisi Capaian</SheetTitle>
                                            <SheetDescription className="text-sm text-slate-500">
                                                Berikan catatan detail bagian mana yang perlu diperbaiki oleh pendamping pada laporan bulanan ini.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                            <div className="space-y-3">
                                                <Label htmlFor="note" className="text-sm font-semibold text-slate-700">Catatan Masukan</Label>
                                                <Textarea
                                                    id="note"
                                                    placeholder="Contoh: Lampiran bukti transaksi belum lengkap, mohon diunggah kembali."
                                                    className="min-h-[180px] border-slate-200 focus:ring-amber-500/20 focus:border-amber-500 rounded-xl resize-none"
                                                    value={revisionNote}
                                                    onChange={(e) => setRevisionNote(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <SheetFooter className="p-6 border-t bg-slate-50/50 flex flex-row gap-3 justify-end">
                                            <Button variant="outline" className="rounded-xl border-slate-200" onClick={() => setIsSheetOpen(false)}>Kembali</Button>
                                            <Button
                                                className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 rounded-xl px-6"
                                                onClick={handleRevision}
                                                disabled={reviewMutation.isPending}
                                            >
                                                {reviewMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                                Kirim Masukan
                                            </Button>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
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
                                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
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
                                <p className="text-sm text-emerald-500">Disetujui</p>
                                <p className="text-2xl font-bold text-emerald-900">{stats.approved}</p>
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
                                <p className="text-2xl font-bold text-amber-900">{stats.revision}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                columns={columns}
                data={reports}
                searchPlaceholder="Cari ID, pendamping, atau peserta..."
                isLoading={isLoading}
            />
        </div>
    )
}
