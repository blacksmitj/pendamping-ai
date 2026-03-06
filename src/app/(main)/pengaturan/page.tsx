"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileDown, FileUp, Database, Globe, Settings2 } from "lucide-react"

export default function PengaturanPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
            </div>

            <Tabs defaultValue="umum" className="w-full">
                <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
                    <TabsTrigger value="umum">Umum</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                    <TabsTrigger value="integrasi">Integrasi</TabsTrigger>
                </TabsList>

                <TabsContent value="umum" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings2 className="h-5 w-5 text-indigo-600" />
                                Konfigurasi Umum
                            </CardTitle>
                            <CardDescription>Atur informasi dasar program pendampingan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="appName">Nama Aplikasi</Label>
                                    <Input id="appName" defaultValue="Pendamping AI" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Tahun Program</Label>
                                    <Select defaultValue="2026">
                                        <SelectTrigger id="year">
                                            <SelectValue placeholder="Pilih tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2026">2026</SelectItem>
                                            <SelectItem value="2027">2027</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2 md:max-w-xs">
                                <Label htmlFor="period">Periode Aktif</Label>
                                <Select defaultValue="jan-des">
                                    <SelectTrigger id="period">
                                        <SelectValue placeholder="Pilih periode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="jan-jun">Januari - Juni</SelectItem>
                                        <SelectItem value="jul-des">Juli - Desember</SelectItem>
                                        <SelectItem value="jan-des">Januari - Desember</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6 bg-muted/20">
                            <Button className="bg-indigo-600">Simpan Perubahan</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-emerald-600" />
                                Manajemen Data
                            </CardTitle>
                            <CardDescription>Eksport dan import data sistem ke dalam format file.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <p className="font-medium text-sm">Download Semua Data Peserta</p>
                                    <p className="text-xs text-muted-foreground">Format CSV, termasuk data pendampingan.</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <FileDown className="mr-2 h-4 w-4" /> Export CSV
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <p className="font-medium text-sm">Download Laporan Logbook</p>
                                    <p className="text-xs text-muted-foreground">Eksport semua aktivitas logbook ke Excel.</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    <FileDown className="mr-2 h-4 w-4" /> Export Excel
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-indigo-50/50 border-indigo-100">
                                <div className="space-y-0.5 text-indigo-900">
                                    <p className="font-medium text-sm">Bulk Update Status Peserta</p>
                                    <p className="text-xs text-indigo-700/70">Upload Excel untuk update status banyak peserta sekaligus.</p>
                                </div>
                                <Button variant="secondary" size="sm" className="bg-white border-indigo-200 text-indigo-600">
                                    <FileUp className="mr-2 h-4 w-4" /> Upload Excel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrasi" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-amber-600" />
                                Integrasi Layanan External
                            </CardTitle>
                            <CardDescription>Konfigurasi penyimpanan file dan integrasi API.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Minio / Object Storage</Label>
                                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Terhubung</Badge>
                                </div>
                                <Input defaultValue="https://minio.api.pendamping.id" />
                                <p className="text-xs text-muted-foreground">Digunakan untuk menyimpan file bukti logbook dan dokumentasi.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6">
                            <Button variant="outline" className="text-indigo-600">Tes Koneksi</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
