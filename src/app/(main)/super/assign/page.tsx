"use client"

import * as React from "react"
import * as XLSX from "xlsx"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Save, Info, Loader2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { toast } from "sonner"
import { Copy, Check, Search } from "lucide-react"

export default function SuperAssignPage() {
    const [file, setFile] = React.useState<File | null>(null)
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const [parsedData, setParsedData] = React.useState<any[]>([])
    const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState<string>("")
    const [dbNames, setDbNames] = React.useState<Record<string, string>>({})

    const { data: workspaces, isLoading: isLoadingWorkspaces } = useQuery({
        queryKey: queryKeys.workspaces.all,
        queryFn: async () => {
            const res = await fetch("/api/workspaces")
            if (!res.ok) throw new Error("Failed to fetch workspaces")
            return res.json()
        },
    })

    const { data: universities } = useQuery({
        queryKey: ["universities", "simple"],
        queryFn: async () => {
            const res = await fetch("/api/universities")
            if (!res.ok) throw new Error("Failed to fetch universities")
            return res.json()
        },
    })

    const [searchUniv, setSearchUniv] = React.useState("")
    const [copiedId, setCopiedId] = React.useState<string | null>(null)

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        toast.success("Teks berhasil disalin!")
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filteredUniversities = universities?.filter((u: any) =>
        u.name.toLowerCase().includes(searchUniv.toLowerCase()) ||
        u.code.toLowerCase().includes(searchUniv.toLowerCase())
    )

    const handeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setParsedData([])
        }
    }

    const processFile = async () => {
        if (!file) return

        try {
            setIsProcessing(true)
            setProgress(10)

            const data = await file.arrayBuffer()
            setProgress(30)

            const workbook = XLSX.read(data)
            setProgress(60)

            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)

            setProgress(90)
            setParsedData(jsonData)

            // Look up participant names from DB
            const tkmIds = jsonData
                .map((row: any) => row.id_tkm?.toString())
                .filter(Boolean);

            if (tkmIds.length > 0) {
                const res = await fetch(`/api/participants?tkmIds=${tkmIds.join(",")}`)
                if (res.ok) {
                    const participants = await res.json()
                    const names: Record<string, string> = {}
                    participants.forEach((p: any) => {
                        if (p.tkmId) names[p.tkmId] = p.fullName
                    })
                    setDbNames(names);
                }
            }

            setProgress(100)
            toast.success(`Berhasil mengonversi ${jsonData.length} baris data.`)
        } catch (error) {
            console.error("Error processing file:", error)
            toast.error("Gagal membaca file Excel.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSave = async () => {
        if (!selectedWorkspaceId || parsedData.length === 0) return

        try {
            setIsSaving(true)
            const response = await fetch("/api/participants/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: selectedWorkspaceId,
                    participants: parsedData,
                }),
            })

            if (!response.ok) {
                throw new Error("Gagal mengimpor data")
            }

            const result = await response.json()
            toast.success(`Berhasil mengimpor ${result.count} peserta!`)
            setFile(null)
            setParsedData([])
        } catch (error) {
            console.error("Save error:", error)
            toast.error("Terjadi kesalahan saat menyimpan data.")
        } finally {
            setIsSaving(false)
        }
    }

    const univMap = React.useMemo(() => {
        const map = new Map<string, string>()
        universities?.forEach((u: any) => {
            map.set(u.code.toLowerCase(), u.name)
            map.set(u.id, u.name)
        })
        return map
    }, [universities])

    const getUniversityName = (p: any) => {
        const code = p.id_universitas?.toString() || p.kode_universitas?.toString()
        if (!code) return "Tidak Ada"
        return univMap.get(code.toLowerCase()) || `Tidak Ditemukan (${code})`
    }

    const columns: any[] = [
        {
            header: "ID TKM",
            accessor: "id_tkm",
            cell: (item: any) => (
                <code className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.id_tkm || "-"}
                </code>
            )
        },
        {
            header: "Nama Peserta",
            accessor: "nama_pendaftar",
            cell: (item: any) => {
                const excelName = item.nama_pendaftar;
                const dbName = item.id_tkm ? dbNames[item.id_tkm.toString()] : null;

                if (excelName && excelName !== "-" && excelName !== "") return excelName;
                if (dbName) return (
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{dbName}</span>
                        <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 w-fit rounded border border-emerald-100 mt-0.5">Found in Database</span>
                    </div>
                );
                return <span className="text-slate-400 italic">No name provided</span>;
            }
        },
        {
            header: "Target Universitas",
            accessor: "kode_universitas",
            cell: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{getUniversityName(item)}</span>
                    <span className="text-[10px] text-slate-500">ID/Code: {item.id_universitas || item.kode_universitas || "-"}</span>
                </div>
            )
        },
        {
            header: "Status Cek",
            id: "status_check",
            cell: (item: any) => {
                const univName = getUniversityName(item)
                const isValid = univName !== "Tidak Ada" && !univName.startsWith("Tidak Ditemukan")

                return (
                    <div className="flex items-center gap-1.5 font-medium">
                        {isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                        )}
                        <span className={isValid ? 'text-emerald-600' : 'text-rose-600'}>
                            {isValid ? 'Valid' : 'Invalid'}
                        </span>
                    </div>
                )
            }
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <PageHeader
                    title="Bulk Assign Peserta"
                    description="Upload data peserta dari Excel dan bagikan otomatis ke masing-masing universitas mitra."
                />
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                            <Info className="mr-2 h-4 w-4" /> Daftar Universitas
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle>Referensi Universitas</SheetTitle>
                            <SheetDescription>
                                Gunakan <strong>Kode</strong> atau <strong>ID</strong> di bawah ini untuk kolom <code>kode_universitas</code> atau <code>id_universitas</code> di Excel Anda.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Cari universitas atau kode..."
                                    className="pl-9"
                                    value={searchUniv}
                                    onChange={(e) => setSearchUniv(e.target.value)}
                                />
                            </div>

                            <div className="border rounded-lg divide-y">
                                {filteredUniversities?.map((u: any) => (
                                    <div key={u.id} className="p-3 space-y-2 hover:bg-slate-50 transition-colors">
                                        <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kode Univ</span>
                                                <div className="flex items-center justify-between bg-white border rounded px-2 py-1 group">
                                                    <code className="text-[11px] font-mono text-indigo-600 font-bold">{u.code}</code>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleCopy(u.code, `${u.id}-code`)}
                                                    >
                                                        {copiedId === `${u.id}-code` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ID Univ</span>
                                                <div className="flex items-center justify-between bg-white border rounded px-2 py-1 group">
                                                    <code className="text-[11px] font-mono text-emerald-600 font-bold">{u.id.substring(0, 8)}...</code>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleCopy(u.id, `${u.id}-id`)}
                                                    >
                                                        {copiedId === `${u.id}-id` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredUniversities?.length === 0 && (
                                    <div className="p-8 text-center text-slate-500 italic text-sm">
                                        Universitas tidak ditemukan.
                                    </div>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Konfigurasi</CardTitle>
                            <CardDescription>Pilih workspace tujuan import.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700">Workspace Target</label>
                                <Select onValueChange={setSelectedWorkspaceId} value={selectedWorkspaceId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Workspace" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workspaces?.map((w: any) => (
                                            <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-dashed border-2">
                        <CardHeader>
                            <CardTitle className="text-center text-lg">Upload Data Excel</CardTitle>
                            <CardDescription className="text-center">Siapkan file excel sesuai format.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
                            {!file ? (
                                <>
                                    <div className="h-16 w-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Upload className="h-8 w-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium">Klik untuk pilih file</p>
                                        <p className="text-xs text-slate-500">atau drag and drop (XLSX, XLS)</p>
                                    </div>
                                    <input
                                        type="file"
                                        id="excel-upload"
                                        className="hidden"
                                        accept=".xlsx, .xls"
                                        onChange={handeFileChange}
                                    />
                                    <Button
                                        className="w-full bg-indigo-600"
                                        onClick={() => document.getElementById('excel-upload')?.click()}
                                    >
                                        Pilih File
                                    </Button>
                                </>
                            ) : (
                                <div className="w-full space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileSpreadsheet className="h-8 w-8 text-emerald-600 shrink-0" />
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-medium truncate">{file.name}</span>
                                                <span className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(2)} KB</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                            <Trash2 className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </div>

                                    {parsedData.length === 0 ? (
                                        <Button
                                            className="w-full bg-indigo-600"
                                            onClick={processFile}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            )}
                                            Proses File
                                        </Button>
                                    ) : (
                                        <div className="text-center p-2 rounded bg-emerald-50 border border-emerald-100">
                                            <p className="text-xs font-semibold text-emerald-700">{parsedData.length} baris data diproses</p>
                                        </div>
                                    )}

                                    {isProcessing && (
                                        <div className="w-full space-y-2">
                                            <div className="flex justify-between text-[10px] font-medium">
                                                <span> {progress === 100 ? "Selesai" : "Memproses..."}</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <Progress value={progress} className="h-1" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-indigo-50 border-indigo-100 shadow-none">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 text-indigo-600 mt-1" />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-indigo-900">Instruksi Bulk Assign</p>
                                    <p className="text-[10px] text-indigo-700 leading-relaxed">
                                        Pastikan file Excel memiliki header kolom minimal:
                                    </p>
                                    <div className="mt-2 overflow-hidden border border-indigo-200 rounded-md bg-white">
                                        <table className="w-full text-[9px] text-left">
                                            <thead className="bg-indigo-50 border-b border-indigo-100">
                                                <tr>
                                                    <th className="px-2 py-1 font-bold text-indigo-900">id_tkm</th>
                                                    <th className="px-2 py-1 font-bold text-indigo-900">kode_universitas</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="px-2 py-1 border-t border-indigo-50 text-slate-500 italic">ID Unik TKM</td>
                                                    <td className="px-2 py-1 border-t border-indigo-50 text-slate-500 italic">Kode Univ (mis: UI)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[9px] text-indigo-600 mt-2 font-medium italic leading-tight">
                                        * Gunakan <strong>id_universitas</strong> jika tidak ada kode. <br />
                                        * Kolom <strong>nama_pendaftar</strong> opsional.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 shrink-0">
                            <div>
                                <CardTitle className="text-lg">Preview Data</CardTitle>
                                <CardDescription>Tinjauan {parsedData.length > 0 ? "data teratas" : "kosong"}</CardDescription>
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || parsedData.length === 0 || !selectedWorkspaceId}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isSaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Finalisasi Import
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto">
                            <DataTable
                                columns={columns}
                                data={parsedData.slice(0, 10)}
                                searchPlaceholder="Cari di preview..."
                            />
                            {parsedData.length > 10 && (
                                <p className="text-center text-[10px] text-slate-400 mt-4">
                                    Hanya menampilkan 10 baris pertama untuk preview. Total {parsedData.length} data.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
