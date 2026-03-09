"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Calendar, TrendingUp, DollarSign, Package, Users, FileText, AlertTriangle, Briefcase, MapPin, Image as ImageIcon, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"

export default function CapaianOutputDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const { data: output, isLoading } = useQuery({
        queryKey: ["outputs", id],
        queryFn: async () => {
            const res = await fetch(`/api/outputs/${id}`)
            if (!res.ok) throw new Error("Gagal mengambil data")
            return res.json()
        },
        enabled: !!id
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
                <p className="text-muted-foreground italic">Memuat detail laporan...</p>
            </div>
        )
    }

    if (!output) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
                <h2 className="text-xl font-bold">Laporan Tidak Ditemukan</h2>
                <Button variant="link" onClick={() => router.back()}>Kembali</Button>
            </div>
        )
    }

    const monthName = new Date(output.reportMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    const mentorName = output.participant?.assignments?.[0]?.mentor?.name || "Unknown Mentor"

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Detail Capaian Output</h1>
                        <Badge variant="outline" className="text-xs font-mono">{output.id.substring(0, 8)}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Laporan bulan {monthName} - {output.participant?.fullName}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {output.reviewStatus === "DRAFT" && (
                        <Button variant="outline" onClick={() => router.push(`/output/${output.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Capaian
                        </Button>
                    )}

                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Participant Info */}
                <Card className="lg:col-span-1 border-none shadow-md bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-500" />
                            Informasi Peserta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama Peserta</p>
                                <p className="text-sm font-medium">{output.participant?.fullName}</p>
                                <Badge variant="secondary" className="mt-1 font-mono text-[10px]">{output.participant?.tkmId}</Badge>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sektor Usaha</p>
                                <p className="text-sm text-muted-foreground">{output.participant?.businessSector || "-"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendamping</p>
                                <p className="text-sm text-muted-foreground">{mentorName}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 pt-2">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Review</p>
                                <Badge className="mt-1">{output.reviewStatus}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial & Production Data */}
                <Card className="lg:col-span-2 border-none shadow-md bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Data Keuangan & Produksi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Omzet Bulan Ini</span>
                                <p className="text-xl font-bold text-slate-900">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(output.revenue))}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kondisi Usaha</span>
                                <p className="text-xl font-bold text-emerald-600">{output.businessCondition}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Volume Jual</span>
                                <p className="text-xl font-bold">{output.salesVolume} <span className="text-xs font-normal text-muted-foreground">{output.salesVolumeUnit}</span></p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kapasitas Maks</span>
                                <p className="text-xl font-bold">{output.productionCapacity} <span className="text-xs font-normal text-muted-foreground">{output.productionCapacityUnit}</span></p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Area Pemasaran</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-indigo-500" />
                                    <span className="text-sm font-medium">{output.marketingArea}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pembukuan Cashflow</p>
                                <Badge variant={output.hasCashflowBookkeeping ? "default" : "outline"} className="mt-1">
                                    {output.hasCashflowBookkeeping ? "Tersedia" : "Tidak Ada"}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Laba Rugi</p>
                                <Badge variant={output.hasIncomeStatementBookkeeping ? "default" : "outline"} className="mt-1">
                                    {output.hasIncomeStatementBookkeeping ? "Tersedia" : "Tidak Ada"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Obstacle & Files */}
                <div className="space-y-6">
                    <Card className="border-amber-100 bg-amber-50/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg text-amber-700">
                                <AlertTriangle className="h-5 w-5" />
                                Kendala Bulan Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-amber-900 leading-relaxed italic">
                                "{output.obstacle || "Tidak ada kendala yang dilaporkan."}"
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon className="h-5 w-5 text-indigo-500" />
                                Bukti & Dokumentasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bukti Omzet</p>
                                    <div className="aspect-video rounded-lg border overflow-hidden relative group bg-muted flex items-center justify-center">
                                        {output.incomeProofUrl ? (
                                            <>
                                                <img
                                                    src={`/api/proxy-image?path=${encodeURIComponent(output.incomeProofUrl)}`}
                                                    alt="Bukti Omzet"
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <a href={`/api/proxy-file?path=${encodeURIComponent(output.incomeProofUrl)}`} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <Download className="h-6 w-6" />
                                                </a>
                                            </>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">Tidak ada lampiran</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bukti Cashflow</p>
                                    <div className="aspect-video rounded-lg border overflow-hidden relative group bg-muted flex items-center justify-center">
                                        {output.cashflowProofUrl ? (
                                            <>
                                                <img
                                                    src={`/api/proxy-image?path=${encodeURIComponent(output.cashflowProofUrl)}`}
                                                    alt="Bukti Cashflow"
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <a href={`/api/proxy-file?path=${encodeURIComponent(output.cashflowProofUrl)}`} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <Download className="h-6 w-6" />
                                                </a>
                                            </>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">Tidak ada lampiran</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">LPJ / Dokumen Pendukung</p>
                                {output.lpjUrl ? (
                                    <div className="flex items-center gap-3 p-3 border rounded-lg max-w-sm bg-muted/30">
                                        <FileText className="h-8 w-8 text-indigo-500" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{output.lpjUrl.split('/').pop()}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Dokumen Laporan</p>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={`/api/proxy-file?path=${encodeURIComponent(output.lpjUrl)}`} target="_blank">View</a>
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Tidak ada dokumen LPJ.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* New Employees */}
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-indigo-500" />
                                Tenaga Kerja Baru
                            </CardTitle>
                            <CardDescription>Penambahan tenaga kerja pada bulan ini.</CardDescription>
                        </div>
                        <Badge variant="outline" className="font-bold">{output.employees?.length || 0} Orang</Badge>
                    </CardHeader>
                    <CardContent>
                        {(output.employees?.length || 0) > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {output.employees.map((emp: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <div className="font-medium">{emp.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono">{emp.nik}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-[10px]">{emp.employmentStatus}</Badge>
                                            </TableCell>
                                            <TableCell>{emp.gender === 'M' ? 'Pria' : 'Wanita'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                        <a href={`/api/proxy-file?path=${encodeURIComponent(emp.idCardUrl)}`} target="_blank" title="KTP">
                                                            <ImageIcon className="h-3.5 w-3.5" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                        <a href={`/api/proxy-file?path=${encodeURIComponent(emp.salarySlipUrl)}`} target="_blank" title="Slip Gaji">
                                                            <DollarSign className="h-3.5 w-3.5" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-sm text-muted-foreground">Tidak ada penambahan tenaga kerja baru.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Review History */}
            {output.reviews?.length > 0 && (
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Riwayat Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {output.reviews.map((rev: any, idx: number) => (
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
    )
}
