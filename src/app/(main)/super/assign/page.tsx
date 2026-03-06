"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Save, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const bulkPreview = [
    { id: "PRE-01", name: "Ahmad Rifai", university: "Universitas Indonesia", status: "Valid" },
    { id: "PRE-02", name: "Budi Santoso", university: "IPB University", status: "Valid" },
    { id: "PRE-03", name: "Citra Lestari", university: "Belum Terdaftar", status: "Error" },
]

export default function SuperAssignPage() {
    const [progress, setProgress] = React.useState(0)
    const [isUploading, setIsUploading] = React.useState(false)

    const startUpload = () => {
        setIsUploading(true)
        let p = 0
        const interval = setInterval(() => {
            p += 10
            setProgress(p)
            if (p >= 100) {
                clearInterval(interval)
                setIsUploading(false)
            }
        }, 300)
    }

    const columns: any[] = [
        { header: "Nama Peserta", accessor: "name" },
        { header: "Target Universitas", accessor: "university" },
        {
            header: "Status Cek",
            accessor: "status",
            cell: (item: any) => (
                <div className="flex items-center gap-1.5 font-medium">
                    {item.status === 'Valid' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-rose-500" />}
                    <span className={item.status === 'Valid' ? 'text-emerald-600' : 'text-rose-600'}>{item.status}</span>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Bulk Assign Peserta"
                description="Upload data peserta dari Excel dan bagikan otomatis ke masing-masing universitas mitra."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 border-dashed border-2">
                    <CardHeader>
                        <CardTitle className="text-center text-lg">Upload Data Excel</CardTitle>
                        <CardDescription className="text-center">Siapkan file excel sesuai format (9000+ data).</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Upload className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">Klik untuk pilih file</p>
                            <p className="text-xs text-slate-500">atau drag and drop (XLSX, CSV)</p>
                        </div>
                        <Button
                            className="w-full bg-indigo-600"
                            onClick={startUpload}
                            disabled={isUploading}
                        >
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Proses File
                        </Button>

                        {isUploading && (
                            <div className="w-full space-y-2 mt-4">
                                <div className="flex justify-between text-[10px] font-medium">
                                    <span>Memproses baris data...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-lg">Preview Data</CardTitle>
                                <CardDescription>Tinjauan 3 baris pertama data yang akan diimport.</CardDescription>
                            </div>
                            <Button disabled={isUploading || progress === 0} className="bg-emerald-600 hover:bg-emerald-700">
                                <Save className="mr-2 h-4 w-4" /> Finalisasi Import
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={bulkPreview}
                                searchPlaceholder="Cari di preview..."
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-indigo-50 border-indigo-100 shadow-none">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 text-indigo-600 mt-1" />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-indigo-900">Instruksi Bulk Import</p>
                                    <p className="text-xs text-indigo-700 leading-relaxed">
                                        Pastikan kolom `id_universitas` dalam excel Anda sudah sesuai dengan ID yang terdaftar di sistem. Peserta dengan universitas yang tidak terdaftar akan dilewati atau ditandai sebagai error.
                                    </p>
                                    <Button variant="link" className="p-0 h-auto text-[10px] text-indigo-700 font-bold mt-2">Unduh Template Excel v2.0</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
