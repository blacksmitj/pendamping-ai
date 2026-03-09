"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Calendar, Clock, MapPin, Tag, FileText, AlertTriangle, Lightbulb, Receipt, Image as ImageIcon, Users, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"

export default function LogbookDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const { data: logbook, isLoading } = useQuery({
        queryKey: ["logbooks", id],
        queryFn: async () => {
            const res = await fetch(`/api/logbooks?id=${id}`)
            if (!res.ok) throw new Error("Gagal mengambil data logbook")
            return res.json()
        },
        enabled: !!id
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                <p className="text-muted-foreground italic">Memuat detail logbook...</p>
            </div>
        )
    }

    if (!logbook) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
                <h2 className="text-xl font-bold">Logbook Tidak Ditemukan</h2>
                <Button variant="link" onClick={() => router.back()}>Kembali</Button>
            </div>
        )
    }

    const formattedDate = new Date(logbook.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    const startTime = new Date(logbook.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const endTime = new Date(logbook.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Detail Logbook</h1>
                        <Badge variant="outline" className="text-xs font-mono">{logbook.id.substring(0, 8)}</Badge>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {logbook.reviewStatus === "DRAFT" && (
                        <Button variant="outline" onClick={() => router.push(`/logbook/${logbook.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Logbook
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Info Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Informasi Utama</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal</p>
                                    <p className="text-sm font-medium">{formattedDate}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Waktu Pelaksanaan</p>
                                    <p className="text-sm font-medium">{startTime} - {endTime} WIB</p>
                                    <p className="text-xs text-muted-foreground mt-1">Total: {logbook.studyHours} Jam Pelajaran</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metode & Lokasi</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <Badge variant="secondary">{logbook.deliveryMethod === 'FACE_TO_FACE' ? 'Tatap Muka' : 'Online'}</Badge>
                                        <Badge variant="outline">{logbook.visitType}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Tag className="h-5 w-5 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topik / Materi</p>
                                    <p className="text-sm font-medium">{logbook.material}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <Receipt className="h-5 w-5 text-rose-500 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Biaya Operasional</p>
                                    <p className="text-sm font-medium">
                                        {Number(logbook.totalExpense) > 0
                                            ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(logbook.totalExpense))
                                            : "Tidak ada biaya"
                                        }
                                    </p>
                                    {logbook.noExpenseReason && (
                                        <p className="text-xs text-muted-foreground mt-1 italic">"{logbook.noExpenseReason}"</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-indigo-500" />
                                Peserta Hadir ({logbook.logbookParticipants?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {logbook.logbookParticipants?.map((lp: any) => (
                                    <div key={lp.participant.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/30">
                                        <div>
                                            <p className="font-medium text-sm">{lp.participant.fullName}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground">{lp.participant.tkmId}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!logbook.logbookParticipants || logbook.logbookParticipants.length === 0) && (
                                    <p className="text-xs text-muted-foreground italic">Tidak ada peserta tercatat.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-indigo-500" />
                                Ringkasan Kegiatan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{logbook.summary}</p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-rose-100 bg-rose-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg text-rose-700">
                                    <AlertTriangle className="h-5 w-5" />
                                    Kendala Ditemui
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-rose-900 leading-relaxed italic">
                                    "{logbook.obstacle || "Tidak ada catatan kendala."}"
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-emerald-100 bg-emerald-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg text-emerald-700">
                                    <Lightbulb className="h-5 w-5" />
                                    Solusi / Tindak Lanjut
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-emerald-900 leading-relaxed italic">
                                    "{logbook.solution || "Tidak ada catatan solusi."}"
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon className="h-5 w-5 text-indigo-500" />
                                Dokumentasi & Bukti
                            </CardTitle>
                            <CardDescription>Foto kegiatan dan bukti biaya operasional.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Photo Documentation */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Foto Kegiatan</p>
                                {logbook.documentationUrls?.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {logbook.documentationUrls.map((url: string, i: number) => (
                                            <div key={i} className="aspect-[4/3] rounded-lg border overflow-hidden relative group bg-muted">
                                                <img
                                                    src={`/api/proxy-image?path=${encodeURIComponent(url)}`}
                                                    alt={`Dokumentasi ${i + 1}`}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <a href={`/api/proxy-file?path=${encodeURIComponent(url)}`} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <Download className="h-6 w-6" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border border-dashed rounded-lg bg-muted/20">
                                        <p className="text-xs text-muted-foreground italic">Belum ada dokumentasi foto</p>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Expense Proof */}
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Bukti Biaya Operasional</p>
                                {logbook.expenseProofUrl ? (
                                    <div className="max-w-sm aspect-video rounded-lg border overflow-hidden relative group bg-muted">
                                        <img
                                            src={`/api/proxy-image?path=${encodeURIComponent(logbook.expenseProofUrl)}`}
                                            alt="Bukti Biaya"
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <a href={`/api/proxy-file?path=${encodeURIComponent(logbook.expenseProofUrl)}`} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                            <Download className="h-6 w-6" />
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">Tidak ada lampiran bukti biaya.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review History */}
                    {logbook.reviews?.length > 0 && (
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Riwayat Review</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {logbook.reviews.map((rev: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-4 rounded-lg bg-muted/30">
                                        <div className="p-2 bg-white rounded-full h-fit shadow-sm">
                                            <FileText className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">Review {rev.action}</span>
                                                <span className="text-[10px] text-muted-foreground">{new Date(rev.createdAt).toLocaleString('id-ID')}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">{rev.note || "Tidak ada catatan."}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
