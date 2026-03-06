"use client"

import * as React from "react"
import * as XLSX from "xlsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileUp, FileCheck, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface ImportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    workspaceId: string
    workspaceName: string
    onSuccess?: () => void
}

export function ImportDialog({
    open,
    onOpenChange,
    workspaceId,
    workspaceName,
    onSuccess
}: ImportDialogProps) {
    const [file, setFile] = React.useState<File | null>(null)
    const [isImporting, setIsImporting] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const [status, setStatus] = React.useState<"idle" | "parsing" | "uploading" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
    const [importedCount, setImportedCount] = React.useState(0)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setStatus("idle")
            setErrorMessage(null)
        }
    }

    const handleImport = async () => {
        if (!file || !workspaceId) return

        try {
            setIsImporting(true)
            setStatus("parsing")
            setProgress(10)

            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data)
            setProgress(30)

            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)
            
            if (jsonData.length === 0) {
                throw new Error("File Excel kosong atau tidak valid.")
            }

            setProgress(50)
            setStatus("uploading")

            const response = await fetch("/api/participants/import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    workspaceId,
                    participants: jsonData,
                }),
            })

            setProgress(90)

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || "Gagal mengimpor data.")
            }

            const result = await response.json()
            setImportedCount(result.count)
            setStatus("success")
            setProgress(100)
            
            if (onSuccess) onSuccess()
        } catch (error: any) {
            console.error("Import error:", error)
            setStatus("error")
            setErrorMessage(error.message || "Terjadi kesalahan saat mengimpor data.")
        } finally {
            setIsImporting(false)
        }
    }

    const reset = () => {
        setFile(null)
        setStatus("idle")
        setProgress(0)
        setErrorMessage(null)
        setImportedCount(0)
    }

    React.useEffect(() => {
        if (!open) {
            // Delay reset to allow closing animation
            setTimeout(reset, 300)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Peserta</DialogTitle>
                    <DialogDescription>
                        Unggah file Excel daftar peserta untuk workspace <strong>{workspaceName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {status === "idle" && (
                        <div className="grid gap-2">
                            <Label htmlFor="excel-file" className="text-sm font-medium">
                                File Excel (.xlsx, .xls)
                            </Label>
                            <Input
                                id="excel-file"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                disabled={isImporting}
                                className="cursor-pointer"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Pastikan header kolom sesuai dengan format yang telah ditentukan di sistem.
                            </p>
                        </div>
                    )}

                    {(status === "parsing" || status === "uploading") && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                                    {status === "parsing" ? "Membaca file..." : "Mengirim data ke database..."}
                                </span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    {status === "success" && (
                        <Alert className="bg-emerald-50 border-emerald-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <AlertTitle className="text-emerald-800">Berhasil!</AlertTitle>
                            <AlertDescription className="text-emerald-700">
                                Berhasil mengimpor <strong>{importedCount}</strong> peserta ke dalam sistem.
                            </AlertDescription>
                        </Alert>
                    )}

                    {status === "error" && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Gagal</AlertTitle>
                            <AlertDescription>
                                {errorMessage}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    {status === "success" ? (
                        <Button onClick={() => onOpenChange(false)} className="bg-emerald-600 hover:bg-emerald-700">
                            Tutup
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isImporting}>
                                Batal
                            </Button>
                            <Button 
                                onClick={handleImport} 
                                disabled={!file || isImporting}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <FileUp className="mr-2 h-4 w-4" />
                                        Mulai Import
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// Simple Label component since I don't want to check if it exists or not, 
// usually it's in @/components/ui/label but I'll make it inline if needed or import it.
import { Label } from "@/components/ui/label"
