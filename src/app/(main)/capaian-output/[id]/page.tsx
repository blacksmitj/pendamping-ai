"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Calendar, TrendingUp, DollarSign, Package, Users, FileText, AlertTriangle, Briefcase, MapPin, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockOutput = {
    id: "OUT-001",
    participantName: "Ahmad Rifai",
    participantId: "T001",
    sector: "Kuliner",
    month: "Maret 2026",
    revenue: 15000000,
    salesVolume: 500,
    productionCapacity: 800,
    capacityUnit: "Porsi",
    marketingArea: "Antar Kabupaten/Kota",
    businessCondition: "Meningkat",
    cashflowBookkeeping: "Ya",
    obstacle: "Harga bahan baku utama (daging ayam) sedang naik, sehingga margin keuntungan sedikit menurun bulan ini.",
    evidencePhoto: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop",
    lpjDocument: "LPJ_Maret_2026_AhmadRifai.pdf",
    newEmployees: [
        {
            nik: "3201012345678901",
            name: "Supriadi",
            gender: "Laki-laki",
            status: "Full-time",
            disability: false
        }
    ]
}

export default function CapaianOutputDetailPage() {
    const router = useRouter()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Detail Capaian Output</h1>
                        <Badge variant="outline" className="text-xs">{mockOutput.id}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Laporan bulan {mockOutput.month} - {mockOutput.participantName}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/capaian-output/${mockOutput.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Capaian
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Participant Info */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Informasi Peserta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-indigo-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Nama Peserta</p>
                                <p className="text-sm text-muted-foreground">{mockOutput.participantName}</p>
                                <Badge variant="secondary" className="mt-1">{mockOutput.participantId}</Badge>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Briefcase className="h-5 w-5 text-indigo-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Sektor Usaha</p>
                                <p className="text-sm text-muted-foreground">{mockOutput.sector}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-indigo-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Periode Laporan</p>
                                <p className="text-sm text-muted-foreground">{mockOutput.month}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial & Production Data */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Data Keuangan & Produksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <DollarSign className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Omzet</span>
                                </div>
                                <p className="text-xl font-bold">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(mockOutput.revenue)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Kondisi</span>
                                </div>
                                <p className="text-xl font-bold text-emerald-600">{mockOutput.businessCondition}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Package className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Penjualan</span>
                                </div>
                                <p className="text-xl font-bold">{mockOutput.salesVolume} <span className="text-sm font-normal text-muted-foreground">{mockOutput.capacityUnit}</span></p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Package className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Kapasitas Maks</span>
                                </div>
                                <p className="text-xl font-bold">{mockOutput.productionCapacity} <span className="text-sm font-normal text-muted-foreground">{mockOutput.capacityUnit}</span></p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Area Pemasaran</p>
                                    <p className="text-sm text-muted-foreground">{mockOutput.marketingArea}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-indigo-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Pembukuan Cashflow</p>
                                    <Badge variant={mockOutput.cashflowBookkeeping === "Ya" ? "default" : "secondary"} className="mt-1">
                                        {mockOutput.cashflowBookkeeping}
                                    </Badge>
                                </div>
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
                            <p className="text-sm text-amber-900 leading-relaxed">
                                {mockOutput.obstacle || "Tidak ada kendala yang dilaporkan."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon className="h-5 w-5 text-indigo-500" />
                                Bukti & Dokumentasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-2">Bukti Omzet / Transaksi</p>
                                <div className="aspect-video rounded-lg border overflow-hidden relative group max-w-sm">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={mockOutput.evidencePhoto}
                                        alt="Bukti Omzet"
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium mb-2">LPJ / Dokumen Pendukung</p>
                                <div className="flex items-center gap-3 p-3 border rounded-lg max-w-sm bg-muted/30">
                                    <FileText className="h-8 w-8 text-indigo-500" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">{mockOutput.lpjDocument}</p>
                                        <p className="text-xs text-muted-foreground">PDF Document</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-indigo-600">Download</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* New Employees */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5 text-indigo-500" />
                                Tenaga Kerja Baru
                            </CardTitle>
                            <CardDescription>Penambahan tenaga kerja pada bulan ini.</CardDescription>
                        </div>
                        <Badge variant="outline" className="font-bold">{mockOutput.newEmployees.length} Orang</Badge>
                    </CardHeader>
                    <CardContent>
                        {mockOutput.newEmployees.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Disabilitas</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockOutput.newEmployees.map((emp, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <div className="font-medium">{emp.name}</div>
                                                <div className="text-xs text-muted-foreground">{emp.nik}</div>
                                            </TableCell>
                                            <TableCell>{emp.gender}</TableCell>
                                            <TableCell>{emp.status}</TableCell>
                                            <TableCell>{emp.disability ? "Ya" : "Tidak"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-muted-foreground">Tidak ada penambahan tenaga kerja baru.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
