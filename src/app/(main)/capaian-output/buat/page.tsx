"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronRight, ChevronLeft, Save, Plus, Trash2, Upload, Calendar } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

const steps = ["Data Utama", "Kondisi & Bukti", "Tenaga Kerja Baru"]

export default function CreateCapaianOutputPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = React.useState(1)
    const [newEmployees, setNewEmployees] = React.useState([{ id: 1 }])

    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

    const addEmployee = () => setNewEmployees([...newEmployees, { id: Date.now() }])
    const removeEmployee = (id: number) => setNewEmployees(newEmployees.filter(e => e.id !== id))

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Buat Laporan Capaian</h1>
                    <p className="text-muted-foreground">Isi data capaian output bulanan peserta binaan.</p>
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
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2 text-center">
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
                            <span className={`text-[10px] sm:text-xs font-medium ${isActive ? "text-indigo-600" : "text-muted-foreground"}`}>
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
                <CardContent className="min-h-[400px]">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Pilih Peserta</Label>
                                    <Select defaultValue="T001">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="T001">Ahmad Rifai</SelectItem>
                                            <SelectItem value="T002">Budi Santoso</SelectItem>
                                            <SelectItem value="T003">Citra Kusuma</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Bulan Laporan</Label>
                                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background flex-row items-center cursor-pointer">
                                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>Maret 2026</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Omzet & Penjualan</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Omzet Bulan Ini</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">Rp</span>
                                            <Input className="pl-10" placeholder="0" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Volume Penjualan (Unit)</Label>
                                        <Input placeholder="0" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Kapasitas Produksi Per Bulan (Maksimal)</Label>
                                <div className="flex gap-4">
                                    <Input placeholder="Jumlah Unit" className="flex-1" />
                                    <Input placeholder="Satuan (ex: Box, Kg)" className="w-1/3" />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>Area Pemasaran</Label>
                                    <RadioGroup defaultValue="village" className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="village" id="village" />
                                            <Label htmlFor="village" className="font-normal">Antar Desa/Kelurahan</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="district" id="district" />
                                            <Label htmlFor="district" className="font-normal">Antar Kabupaten/Kota</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="province" id="province" />
                                            <Label htmlFor="province" className="font-normal">Antar Provinsi</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="national" id="national" />
                                            <Label htmlFor="national" className="font-normal">Nasional/Ekspor</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Kondisi Usaha</Label>
                                        <Select defaultValue="increase">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="increase">Meningkat</SelectItem>
                                                <SelectItem value="stable">Stabil</SelectItem>
                                                <SelectItem value="decrease">Menurun</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Pembukuan Cashflow</Label>
                                        <Select defaultValue="yes">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Ya</SelectItem>
                                                <SelectItem value="no">Tidak</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Kendala / Masalah</Label>
                                <Textarea placeholder="Tuliskan kendala bisnis bulan ini..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Bukti Omzet (File)</Label>
                                    <div className="border border-dashed rounded-md p-3 flex flex-col items-center gap-2 hover:bg-muted/50 cursor-pointer">
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground uppercase">Upload</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">LPJ / Dokumentasi (File)</Label>
                                    <div className="border border-dashed rounded-md p-3 flex flex-col items-center gap-2 hover:bg-muted/50 cursor-pointer">
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground uppercase">Upload</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Tenaga Kerja Baru</h3>
                                    <p className="text-xs text-muted-foreground">Wajib isi jika ada penambahan tenaga kerja bulan ini.</p>
                                </div>
                                <Button onClick={addEmployee} size="sm" variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100">
                                    <Plus className="mr-1 h-3 w-3" /> Tambah TK
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {newEmployees.map((emp, index) => (
                                    <Card key={emp.id} className="relative bg-muted/30">
                                        {newEmployees.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeEmployee(emp.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        )}
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">NIK Tenaga Kerja</Label>
                                                    <Input placeholder="16 digit NIK" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Nama Lengkap</Label>
                                                    <Input placeholder="Sesuai KTP" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Gender</Label>
                                                    <Select><SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="L">Laki-laki</SelectItem>
                                                            <SelectItem value="P">Perempuan</SelectItem>
                                                        </SelectContent></Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Status TK</Label>
                                                    <Select><SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="full">Full-time</SelectItem>
                                                            <SelectItem value="part">Part-time</SelectItem>
                                                        </SelectContent></Select>
                                                </div>
                                                <div className="flex items-center space-x-2 pt-8">
                                                    <Checkbox id={`dis-${emp.id}`} />
                                                    <Label htmlFor={`dis-${emp.id}`} className="text-xs">Disabilitas</Label>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
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
                            <Save className="mr-2 h-4 w-4" /> Simpan Laporan
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

function X({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
