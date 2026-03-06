"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronRight, ChevronLeft, Save, Upload, X, Search, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const steps = ["Info Dasar", "Detail Kegiatan", "Bukti & Dokumentasi"]

export default function EditLogbookPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = React.useState(1)

    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

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
                                    <Input type="date" defaultValue="2026-03-05" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Metode Penyampaian</Label>
                                    <RadioGroup defaultValue="luring" className="flex gap-4 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="luring" id="luring" />
                                            <Label htmlFor="luring">Luring (Tatap Muka)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="daring" id="daring" />
                                            <Label htmlFor="daring">Daring</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jam Mulai</Label>
                                    <Input type="time" defaultValue="09:00" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jam Selesai</Label>
                                    <Input type="time" defaultValue="11:30" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Peserta yang Hadir</Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Cari nama peserta..." className="pl-8" />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                        Ahmad Rifai <X className="h-3 w-3 cursor-pointer" />
                                    </Badge>
                                    <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                        Budi Santoso <X className="h-3 w-3 cursor-pointer" />
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Materi / Topik Pembahasan</Label>
                                <Input placeholder="Contoh: Pembuatan BMC, Analisis Pasar, dll" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ringkasan Kegiatan</Label>
                                <Textarea
                                    placeholder="Ceritakan apa saja yang dibahas dan dilakukan selama pendampingan..."
                                    className="min-h-[120px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Kendala yang Ditemui</Label>
                                    <Textarea placeholder="Opsional" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Solusi / Tindak Lanjut</Label>
                                    <Textarea placeholder="Opsional" />
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
                                        <Input className="pl-10" placeholder="0" type="number" />
                                    </div>
                                    <Button variant="outline" className="shrink-0">
                                        <Upload className="mr-2 h-4 w-4" /> Upload Bukti
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground italic select-none pointer-events-none">
                                    *Isi jika ada pengeluaran transport atau konsumsi selama pendampingan luring.
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label>Dokumentasi Foto (Maks 5)</Label>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 hover:bg-muted/50 cursor-pointer text-muted-foreground">
                                        <Camera className="h-6 w-6" />
                                        <span className="text-[10px]">Pilih Foto</span>
                                    </div>
                                    <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center relative group">
                                        <div className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <X className="h-3 w-3" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">IMG_001.jpg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Sebelumnya
                    </Button>
                    {currentStep < steps.length ? (
                        <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700">
                            Selanjutnya <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
