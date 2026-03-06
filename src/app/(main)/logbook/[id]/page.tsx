"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Calendar, Clock, MapPin, Tag, FileText, AlertTriangle, Lightbulb, Receipt, Image as ImageIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

const mockLogbook = {
    id: "LGB-001",
    date: "5 Maret 2026",
    startTime: "09:00",
    endTime: "11:30",
    method: "Luring (Tatap Muka)",
    topic: "Pembuatan Business Model Canvas (BMC)",
    summary: "Pendampingan langsung ke tempat usaha peserta untuk membantu membuat Business Model Canvas. Peserta sudah memahami konsep dasar dan berhasil mengisi 5 dari 9 blok BMC.",
    obstacle: "Peserta masih kesulitan menentukan segmen pelanggan yang paling spesifik, sehingga value proposition belum terlalu tajam.",
    solution: "Akan dilakukan riset kompetitor sederhana pada pertemuan berikutnya untuk memvalidasi segmen pasar.",
    operationalCost: 50000,
    photos: [
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop"
    ]
}

const mockParticipants = [
    { id: "T001", name: "Ahmad Rifai", sector: "Kuliner" },
    { id: "T005", name: "Eka Sari", sector: "Fashion" }
]

export default function LogbookDetailPage() {
    const router = useRouter()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Detail Logbook</h1>
                        <Badge variant="outline" className="text-xs">{mockLogbook.id}</Badge>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/logbook/${mockLogbook.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Logbook
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Info Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Informasi Utama</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Tanggal</p>
                                    <p className="text-sm text-muted-foreground">{mockLogbook.date}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Waktu Pelaksanaan</p>
                                    <p className="text-sm text-muted-foreground">{mockLogbook.startTime} - {mockLogbook.endTime} WIB</p>
                                    <p className="text-xs text-muted-foreground mt-1">Total: 2.5 Jam Pelajaran</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Metode</p>
                                    <Badge className="mt-1 bg-emerald-500 text-white hover:bg-emerald-600">{mockLogbook.method}</Badge>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Tag className="h-5 w-5 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Topik / Materi</p>
                                    <p className="text-sm text-muted-foreground">{mockLogbook.topic}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <Receipt className="h-5 w-5 text-rose-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Biaya Operasional</p>
                                    <p className="text-sm text-muted-foreground">
                                        {mockLogbook.operationalCost > 0
                                            ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(mockLogbook.operationalCost)
                                            : "Tidak ada"
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-indigo-500" />
                                Peserta Hadir ({mockParticipants.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockParticipants.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/30">
                                        <div>
                                            <p className="font-medium text-sm">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{p.sector}</p>
                                        </div>
                                        <Badge variant="outline" className="text-[10px]">{p.id}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-indigo-500" />
                                Ringkasan Kegiatan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{mockLogbook.summary}</p>
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
                                <p className="text-sm text-rose-900 leading-relaxed">
                                    {mockLogbook.obstacle || "Tidak ada catatan kendala."}
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
                                <p className="text-sm text-emerald-900 leading-relaxed">
                                    {mockLogbook.solution || "Tidak ada catatan solusi."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon className="h-5 w-5 text-indigo-500" />
                                Dokumentasi & Bukti
                            </CardTitle>
                            <CardDescription>Foto kegiatan dan bukti pendukung lainnya.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mockLogbook.photos.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {mockLogbook.photos.map((url, i) => (
                                        <div key={i} className="aspect-[4/3] rounded-lg border overflow-hidden relative group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={url}
                                                alt={`Dokumentasi ${i + 1}`}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                    <p className="text-sm font-medium text-muted-foreground text-center">Belum ada dokumentasi</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
