"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Check, ChevronRight, ChevronLeft, Save, Upload, X, Search, Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import { uploadFileToMinio } from "@/lib/storage-client"

const steps = ["Info Dasar", "Detail Kegiatan", "Bukti & Dokumentasi"]

export default function EditLogbookPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const [currentStep, setCurrentStep] = React.useState(1)

    // Form State
    const [date, setDate] = React.useState("")
    const [deliveryMethod, setDeliveryMethod] = React.useState<"FACE_TO_FACE" | "ONLINE">("FACE_TO_FACE")
    const [meetingType, setMeetingType] = React.useState<"INDIVIDUAL" | "GROUP">("INDIVIDUAL")
    const [visitType, setVisitType] = React.useState("Rutin")
    const [startTime, setStartTime] = React.useState("")
    const [endTime, setEndTime] = React.useState("")
    const [participantIds, setParticipantIds] = React.useState<string[]>([])
    const [participantSearch, setParticipantSearch] = React.useState("")

    const [material, setMaterial] = React.useState("")
    const [summary, setSummary] = React.useState("")
    const [obstacle, setObstacle] = React.useState("")
    const [solution, setSolution] = React.useState("")

    const [totalExpense, setTotalExpense] = React.useState("")
    const [expenseProofFile, setExpenseProofFile] = React.useState<File | null>(null)
    const [photoFiles, setPhotoFiles] = React.useState<File[]>([])
    const [existingPhotoUrls, setExistingPhotoUrls] = React.useState<string[]>([])
    const [existingExpenseUrl, setExistingExpenseUrl] = React.useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Calculate study hours roughly
    const calculateStudyHours = () => {
        if (!startTime || !endTime) return 0;
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        return Math.max(0, Math.round(((endH * 60 + endM) - (startH * 60 + startM)) / 60));
    }

    // Fetch Logbook data
    const { data: logbook, isLoading: isLogbookLoading } = useQuery({
        queryKey: ["logbook", id],
        queryFn: async () => {
            const res = await fetch(`/api/logbooks?id=${id}`)
            if (!res.ok) throw new Error("Gagal mengambil data logbook")
            return res.json()
        },
        enabled: !!id
    })

    // Fetch Participants Mapping
    const { data: participants = [] } = useQuery({
        queryKey: ["participants", session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) return []
            const res = await fetch(`/api/participants?mentorId=${session.user.id}`)
            if (!res.ok) throw new Error("Gagal mengambil data peserta")
            return res.json()
        },
        enabled: !!session?.user?.id
    })

    // Set initial form state
    React.useEffect(() => {
        if (logbook) {
            setDate(new Date(logbook.date).toISOString().split("T")[0])
            setDeliveryMethod(logbook.deliveryMethod)
            setMeetingType(logbook.meetingType)
            setVisitType(logbook.visitType)

            // Extract HH:mm from ISO
            const dStart = new Date(logbook.startTime)
            setStartTime(`${dStart.getHours().toString().padStart(2, '0')}:${dStart.getMinutes().toString().padStart(2, '0')}`)
            const dEnd = new Date(logbook.endTime)
            setEndTime(`${dEnd.getHours().toString().padStart(2, '0')}:${dEnd.getMinutes().toString().padStart(2, '0')}`)

            setMaterial(logbook.material)
            setSummary(logbook.summary)
            setObstacle(logbook.obstacle)
            setSolution(logbook.solution)

            if (logbook.totalExpense) {
                setTotalExpense(logbook.totalExpense.toString())
            }
            if (logbook.expenseProofUrl) {
                setExistingExpenseUrl(logbook.expenseProofUrl)
            }
            if (logbook.documentationUrls) {
                setExistingPhotoUrls(logbook.documentationUrls)
            }
            if (logbook.logbookParticipants) {
                setParticipantIds(logbook.logbookParticipants.map((lp: any) => lp.participant.id))
            }
        }
    }, [logbook])

    // Submitter
    const handleUpdateLogbook = async () => {
        if (!date || !startTime || !endTime || !material || !summary || participantIds.length === 0) {
            toast.error("Harap lengkapi semua field wajib.")
            return;
        }

        setIsSubmitting(true)
        try {
            // Upload Expense Proof to MinIO if renewed
            let expenseUrl = existingExpenseUrl;
            if (expenseProofFile) {
                expenseUrl = await uploadFileToMinio(expenseProofFile, "pdf")
            }

            // Upload New Photos to MinIO
            const newPhotoUrls: string[] = [];
            for (const file of photoFiles) {
                const url = await uploadFileToMinio(file, "photo")
                if (url) newPhotoUrls.push(url);
            }
            const combinedPhotoUrls = [...existingPhotoUrls, ...newPhotoUrls];

            // Prepare Payload
            const payload = {
                date,
                deliveryMethod,
                meetingType,
                visitType,
                startTime: new Date(`${date}T${startTime}:00`).toISOString(),
                endTime: new Date(`${date}T${endTime}:00`).toISOString(),
                studyHours: calculateStudyHours(),
                material,
                summary,
                obstacle: obstacle || "",
                solution: solution || "",
                totalExpense: totalExpense ? parseFloat(totalExpense) : 0,
                documentationUrls: combinedPhotoUrls,
                expenseProofUrl: expenseUrl,
                noExpenseReason: expenseUrl ? null : "Tidak ada biaya operasional",
                participantIds
            }

            const res = await fetch(`/api/logbooks?id=${id}&action=update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Gagal memperbarui logbook")

            toast.success("Logbook berhasil diperbarui!")
            queryClient.invalidateQueries({ queryKey: ["logbooks"] })
            queryClient.invalidateQueries({ queryKey: ["logbook", id] })
            router.push("/logbook")
        } catch (error: any) {
            console.error(error)
            toast.error(error?.message || "Terjadi kesalahan saat menyimpan perubahan logbook")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

    // Handle Participant Selection
    const toggleParticipant = (pId: string) => {
        setParticipantIds(prev => {
            if (prev.includes(pId)) return prev.filter(x => x !== pId)
            if (meetingType === "INDIVIDUAL") return [pId] // Only one allowed
            return [...prev, pId] // Group allows multiple
        })
    }

    const filteredParticipants = participants.filter((p: any) =>
        p.fullName.toLowerCase().includes(participantSearch.toLowerCase()) ||
        p.tkmId.toLowerCase().includes(participantSearch.toLowerCase())
    ).slice(0, 50) // max 50

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            // Cap to remaining slots vs 5 limit total
            const slotsLeft = 5 - existingPhotoUrls.length;
            setPhotoFiles(prev => [...prev, ...newFiles].slice(0, slotsLeft));
        }
    }

    const totalPhotos = existingPhotoUrls.length + photoFiles.length;

    if (isLogbookLoading) {
        return <div className="flex-1 flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    }

    if (!logbook) {
        return <div className="text-center py-12">Logbook tidak ditemukan.</div>
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Logbook</h1>
                    <p className="text-muted-foreground">Perbarui data logbook yang sudah ada.</p>
                </div>
            </div>

            {/* Stepper Header */}
            <div className="relative flex justify-between items-center px-4 py-8">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
                {steps.map((step, index) => {
                    const stepNum = index + 1
                    const isActive = currentStep === stepNum
                    const isCompleted = currentStep > stepNum

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isActive
                                    ? "border-indigo-600 bg-indigo-600 text-white"
                                    : isCompleted
                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                        : "border-muted bg-background text-muted-foreground"
                                    }`}
                            >
                                {isCompleted ? <Check className="h-5 w-5" /> : stepNum}
                            </div>
                            <span className={`text-xs font-medium ${isActive ? "text-indigo-600" : "text-muted-foreground"}`}>
                                {step}
                            </span>
                        </div>
                    )
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Step {currentStep}: {steps[currentStep - 1]}</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[350px]">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tanggal Kegiatan</Label>
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Metode Penyampaian</Label>
                                    <RadioGroup
                                        value={deliveryMethod}
                                        onValueChange={(v: any) => setDeliveryMethod(v)}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="FACE_TO_FACE" id="f2f" />
                                            <Label htmlFor="f2f">Luring (Tatap Muka)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="ONLINE" id="online" />
                                            <Label htmlFor="online">Daring</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jenis Pertemuan</Label>
                                    <RadioGroup
                                        value={meetingType}
                                        onValueChange={(v: any) => {
                                            setMeetingType(v)
                                            if (v === "INDIVIDUAL" && participantIds.length > 1) {
                                                setParticipantIds([participantIds[0]]);
                                            }
                                        }}
                                        className="flex gap-4 pt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="INDIVIDUAL" id="individual" />
                                            <Label htmlFor="individual">Individual</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="GROUP" id="group" />
                                            <Label htmlFor="group">Kelompok</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipe Kunjungan</Label>
                                    <Input
                                        placeholder="e.g. Rutin / Insidental"
                                        value={visitType}
                                        onChange={(e) => setVisitType(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jam Mulai</Label>
                                    <Input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jam Selesai</Label>
                                    <Input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Peserta yang Hadir {meetingType === "INDIVIDUAL" ? "(Pilih 1)" : "(Bisa lebih dari 1)"}</Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama peserta atau TKM ID..."
                                        className="pl-8"
                                        value={participantSearch}
                                        onChange={(e) => setParticipantSearch(e.target.value)}
                                    />
                                </div>

                                <div className="border rounded-md mt-1 mb-2 max-h-40 overflow-y-auto">
                                    {filteredParticipants.length === 0 ? (
                                        <div className="p-2 text-sm text-muted-foreground">
                                            {participantSearch ? "Peserta tidak ditemukan" : "Tidak ada peserta yang terdaftar untuk Anda."}
                                        </div>
                                    ) : (
                                        filteredParticipants.map((p: any) => (
                                            <div
                                                key={p.id}
                                                className="p-2 text-sm hover:bg-muted cursor-pointer flex justify-between items-center"
                                                onClick={() => toggleParticipant(p.id)}
                                            >
                                                <span>{p.fullName} ({p.tkmId})</span>
                                                {participantIds.includes(p.id) && <Check className="h-4 w-4 text-primary" />}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {participantIds.map(id => {
                                        const p = participants.find((x: any) => x.id === id);
                                        const lpFallback = logbook.logbookParticipants.find((lp: any) => lp.participant.id === id);
                                        const name = p ? p.fullName : (lpFallback ? lpFallback.participant.fullName : "Unknown");
                                        return (
                                            <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                                {name}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleParticipant(id)} />
                                            </Badge>
                                        )
                                    })}
                                    {participantIds.length === 0 && (
                                        <span className="text-sm text-muted-foreground italic">Belum ada peserta yang dipilih</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Materi / Topik Pembahasan</Label>
                                <Input
                                    placeholder="Contoh: Pembuatan BMC, Analisis Pasar, dll"
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ringkasan Kegiatan</Label>
                                <Textarea
                                    placeholder="Ceritakan apa saja yang dibahas dan dilakukan selama pendampingan..."
                                    className="min-h-[120px]"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Kendala yang Ditemui</Label>
                                    <Textarea
                                        placeholder="Opsional"
                                        value={obstacle}
                                        onChange={(e) => setObstacle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Solusi / Tindak Lanjut</Label>
                                    <Textarea
                                        placeholder="Opsional"
                                        value={solution}
                                        onChange={(e) => setSolution(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label>Biaya Operasional (Opsional)</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">Rp</span>
                                        <Input
                                            className="pl-10"
                                            placeholder="0"
                                            type="number"
                                            value={totalExpense}
                                            onChange={(e) => setTotalExpense(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="shrink-0">
                                        <Input
                                            type="file"
                                            id="expense-file"
                                            className="hidden"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setExpenseProofFile(e.target.files[0])
                                                }
                                            }}
                                        />
                                        <Label htmlFor="expense-file" className="cursor-pointer">
                                            <div className="h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border">
                                                <Upload className="mr-2 h-4 w-4" />
                                                {expenseProofFile ? "Ganti File Bukti" : (existingExpenseUrl ? "Ganti File Bukti" : "Upload Bukti")}
                                            </div>
                                        </Label>
                                    </div>
                                </div>
                                {expenseProofFile ? (
                                    <p className="text-sm text-indigo-600 font-medium">{expenseProofFile.name}</p>
                                ) : (
                                    existingExpenseUrl && <p className="text-sm text-indigo-600 font-medium">Ada file saat ini tersimpan.</p>
                                )}
                                <p className="text-xs text-muted-foreground italic select-none pointer-events-none">
                                    *Isi jika ada pengeluaran transport atau konsumsi selama pendampingan luring.
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label>Dokumentasi Foto (Maks 5)</Label>
                                <div className="grid grid-cols-4 gap-4">
                                    {totalPhotos < 5 && (
                                        <div className="aspect-square rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors text-muted-foreground relative">
                                            <Input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                accept="image/*"
                                                multiple
                                                onChange={handlePhotoSelect}
                                            />
                                            <div className="flex flex-col items-center justify-center gap-1 w-full h-full pointer-events-none">
                                                <Camera className="h-6 w-6" />
                                                <span className="text-[10px]">Pilih Foto</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Existing URLs preview */}
                                    {existingPhotoUrls.map((url, idx) => (
                                        <div key={`exist-${idx}`} className="aspect-square rounded-lg border bg-muted flex items-center justify-center relative group overflow-hidden">
                                            <div className="text-xs font-mono break-all p-2 text-center text-muted-foreground">Existing<br />[{idx + 1}]</div>
                                            <div
                                                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
                                                onClick={() => setExistingPhotoUrls(prev => prev.filter((_, i) => i !== idx))}
                                            >
                                                <X className="h-3 w-3" />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Unsaved Files Preview */}
                                    {photoFiles.map((file, idx) => (
                                        <div key={`new-${idx}`} className="aspect-square rounded-lg border bg-muted flex items-center justify-center relative group overflow-hidden">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                                            <div
                                                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
                                                onClick={() => setPhotoFiles(prev => prev.filter((_, i) => i !== idx))}
                                            >
                                                <X className="h-3 w-3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Sebelumnya
                    </Button>
                    {currentStep < steps.length ? (
                        <Button
                            onClick={handleNext}
                            className="bg-indigo-600 hover:bg-indigo-700"
                            disabled={
                                (currentStep === 1 && (!date || !startTime || !endTime || participantIds.length === 0)) ||
                                (currentStep === 2 && (!material || !summary))
                            }
                        >
                            Selanjutnya <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleUpdateLogbook}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Merekam Perubahan...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
