"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronRight, ChevronLeft, Save, Plus, Trash2, Upload, Calendar, Loader2, X, Camera } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import { uploadFileToMinio } from "@/lib/storage-client"

const steps = ["Main Data", "Conditions & Evidence", "New Workers"]

interface EmployeeForm {
    tempId: number
    nik: string
    name: string
    gender: "M" | "F"
    employmentStatus: "FULL_TIME" | "PART_TIME"
    role: string
    isDisabled: boolean
    disabilityType: string
    hasBpjs: boolean
    bpjsType: string
    bpjsNumber: string
    idCardFile: File | null
    bpjsCardFile: File | null
    salarySlipFile: File | null
}

export default function CreateCapaianOutputPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const [currentStep, setCurrentStep] = React.useState(1)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // --- Form State ---
    // Step 1
    const [participantId, setParticipantId] = React.useState("")
    const [reportMonth, setReportMonth] = React.useState(new Date().toISOString().substring(0, 7)) // YYYY-MM
    const [revenue, setRevenue] = React.useState("")
    const [salesVolume, setSalesVolume] = React.useState("")
    const [salesVolumeUnit, setSalesVolumeUnit] = React.useState("Unit")
    const [productionCapacity, setProductionCapacity] = React.useState("")
    const [productionCapacityUnit, setProductionCapacityUnit] = React.useState("Unit")

    // Step 2
    const [marketingArea, setMarketingArea] = React.useState("Lokal")
    const [businessCondition, setBusinessCondition] = React.useState("Stabil")
    const [hasCashflowBookkeeping, setHasCashflowBookkeeping] = React.useState(false)
    const [hasIncomeStatementBookkeeping, setHasIncomeStatementBookkeeping] = React.useState(false)
    const [obstacle, setObstacle] = React.useState("")

    // Files
    const [incomeProofFile, setIncomeProofFile] = React.useState<File | null>(null)
    const [cashflowProofFile, setCashflowProofFile] = React.useState<File | null>(null)
    const [lpjFile, setLpjFile] = React.useState<File | null>(null)

    // Step 3
    const [newEmployees, setNewEmployees] = React.useState<EmployeeForm[]>([])
    const [workerConfirmation, setWorkerConfirmation] = React.useState("Tidak")

    // --- Queries ---
    const { data: participants = [], isLoading: participantsLoading } = useQuery({
        queryKey: ["participants", session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) return []
            const res = await fetch(`/api/participants?mentorId=${session.user.id}`)
            if (!res.ok) throw new Error("Gagal mengambil data peserta")
            return res.json()
        },
        enabled: !!session?.user?.id
    })

    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

    const addEmployee = () => {
        setNewEmployees([...newEmployees, {
            tempId: Date.now(),
            nik: "",
            name: "",
            gender: "M",
            employmentStatus: "FULL_TIME",
            role: "Pekerja",
            isDisabled: false,
            disabilityType: "",
            hasBpjs: false,
            bpjsType: "",
            bpjsNumber: "",
            idCardFile: null,
            bpjsCardFile: null,
            salarySlipFile: null
        }])
        setWorkerConfirmation("Ada")
    }

    const removeEmployee = (tempId: number) => {
        const updated = newEmployees.filter(e => e.tempId !== tempId)
        setNewEmployees(updated)
        if (updated.length === 0) setWorkerConfirmation("Tidak")
    }

    const updateEmployee = (tempId: number, data: Partial<EmployeeForm>) => {
        setNewEmployees(newEmployees.map(e => e.tempId === tempId ? { ...e, ...data } : e))
    }

    const handleSaveOutput = async () => {
        if (!participantId || !reportMonth || !revenue || !salesVolume || !incomeProofFile) {
            toast.error("Harap lengkapi field wajib dan upload bukti pendapatan.")
            return
        }

        setIsSubmitting(true)
        try {
            // 1. Upload Output Files
            const incomeUrl = await uploadFileToMinio(incomeProofFile, "output/income")
            const cashflowUrl = cashflowProofFile ? await uploadFileToMinio(cashflowProofFile, "output/cashflow") : ""
            const lpjUrl = lpjFile ? await uploadFileToMinio(lpjFile, "output/lpj") : ""

            // 2. Upload Employee Files
            const employeesData = []
            for (const emp of newEmployees) {
                if (!emp.idCardFile || !emp.salarySlipFile) {
                    throw new Error(`Karyawan ${emp.name || 'baru'} wajib mengupload KTP dan Slip Gaji.`)
                }

                const idCardUrl = await uploadFileToMinio(emp.idCardFile, "employee/ktp")
                const salarySlipUrl = await uploadFileToMinio(emp.salarySlipFile, "employee/salary")
                const bpjsCardUrl = emp.bpjsCardFile ? await uploadFileToMinio(emp.bpjsCardFile, "employee/bpjs") : ""

                employeesData.push({
                    nik: emp.nik,
                    name: emp.name,
                    gender: emp.gender,
                    employmentStatus: emp.employmentStatus,
                    role: emp.role,
                    isDisabled: emp.isDisabled,
                    disabilityType: emp.disabilityType,
                    hasBpjs: emp.hasBpjs,
                    bpjsType: emp.bpjsType,
                    bpjsNumber: emp.bpjsNumber,
                    idCardUrl,
                    salarySlipUrl,
                    bpjsCardUrl
                })
            }

            // 3. Prepare Payload
            const payload = {
                data: {
                    participantId,
                    reportMonth: new Date(`${reportMonth}-01`).toISOString(),
                    revenue: parseFloat(revenue),
                    salesVolume: parseFloat(salesVolume),
                    salesVolumeUnit,
                    productionCapacity: parseFloat(productionCapacity || "0"),
                    productionCapacityUnit,
                    marketingArea,
                    businessCondition,
                    hasCashflowBookkeeping,
                    hasIncomeStatementBookkeeping,
                    obstacle,
                    incomeProofUrl: incomeUrl,
                    cashflowProofUrl: cashflowUrl,
                    lpjUrl: lpjUrl,
                    workerConfirmation: workerConfirmation
                },
                employees: employeesData
            }

            const res = await fetch("/api/outputs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData?.message || "Gagal menyimpan laporan output")
            }

            toast.success("Laporan output berhasil disimpan!")
            queryClient.invalidateQueries({ queryKey: ["outputs"] })
            router.push("/output")
        } catch (error: any) {
            console.error(error)
            toast.error(error?.message || "Terjadi kesalahan saat menyimpan laporan")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Output Report</h1>
                    <p className="text-muted-foreground">Fill in monthly output data for mentored participants.</p>
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
                                    <Label>Select Participant</Label>
                                    <Select value={participantId} onValueChange={setParticipantId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {participants.map((p: any) => (
                                                <SelectItem key={p.id} value={p.id}>{p.fullName} ({p.tkmId})</SelectItem>
                                            ))}
                                            {participants.length === 0 && !participantsLoading && (
                                                <div className="p-2 text-xs text-muted-foreground text-center">No participants found</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Reporting Month</Label>
                                    <div className="relative">
                                        <Input
                                            type="month"
                                            value={reportMonth}
                                            onChange={(e) => setReportMonth(e.target.value)}
                                            className="pl-10"
                                        />
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg font-semibold">Revenue & Sales</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Revenue This Month (IDR)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">Rp</span>
                                            <Input
                                                className="pl-10"
                                                placeholder="0"
                                                type="number"
                                                value={revenue}
                                                onChange={(e) => setRevenue(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Sales Volume</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="0"
                                                type="number"
                                                value={salesVolume}
                                                onChange={(e) => setSalesVolume(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="Unit (Kg, Box, dll)"
                                                value={salesVolumeUnit}
                                                onChange={(e) => setSalesVolumeUnit(e.target.value)}
                                                className="w-1/3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Monthly Production Capacity (Max)</Label>
                                <div className="flex gap-4">
                                    <Input
                                        placeholder="Amount"
                                        type="number"
                                        value={productionCapacity}
                                        onChange={(e) => setProductionCapacity(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="Unit (Kg, Box, dll)"
                                        value={productionCapacityUnit}
                                        onChange={(e) => setProductionCapacityUnit(e.target.value)}
                                        className="w-1/3"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>Marketing Area</Label>
                                    <RadioGroup value={marketingArea} onValueChange={setMarketingArea} className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Lokal" id="village" />
                                            <Label htmlFor="village" className="font-normal">Local / Village</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Regional" id="district" />
                                            <Label htmlFor="district" className="font-normal">Regional / Inter-City</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Nasional" id="province" />
                                            <Label htmlFor="province" className="font-normal">National</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Ekspor" id="national" />
                                            <Label htmlFor="national" className="font-normal">Export</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Business Condition</Label>
                                        <Select value={businessCondition} onValueChange={setBusinessCondition}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Meningkat">Increasing</SelectItem>
                                                <SelectItem value="Stabil">Stable</SelectItem>
                                                <SelectItem value="Menurun">Decreasing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="cashflow" checked={hasCashflowBookkeeping} onCheckedChange={(v) => setHasCashflowBookkeeping(!!v)} />
                                            <Label htmlFor="cashflow" className="text-xs">Have Cashflow Bookkeeping</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="income" checked={hasIncomeStatementBookkeeping} onCheckedChange={(v) => setHasIncomeStatementBookkeeping(!!v)} />
                                            <Label htmlFor="income" className="text-xs">Have Income Statement Bookkeeping</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Obstacles / Issues</Label>
                                <Textarea
                                    placeholder="Describe business obstacles this month..."
                                    value={obstacle}
                                    onChange={(e) => setObstacle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Revenue Proof (Image/PDF) *</Label>
                                    <div className="border border-dashed rounded-md p-3 flex flex-col items-center gap-2 hover:bg-muted/50 cursor-pointer relative">
                                        <Input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setIncomeProofFile(e.target.files?.[0] || null)}
                                        />
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground uppercase text-center">
                                            {incomeProofFile ? incomeProofFile.name : "Upload Proof"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Cashflow Proof (Filter)</Label>
                                    <div className="border border-dashed rounded-md p-3 flex flex-col items-center gap-2 hover:bg-muted/50 cursor-pointer relative">
                                        <Input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setCashflowProofFile(e.target.files?.[0] || null)}
                                        />
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground uppercase text-center">
                                            {cashflowProofFile ? cashflowProofFile.name : "Upload Proof"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">LPJ / Documentation (File)</Label>
                                    <div className="border border-dashed rounded-md p-3 flex flex-col items-center gap-2 hover:bg-muted/50 cursor-pointer relative">
                                        <Input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setLpjFile(e.target.files?.[0] || null)}
                                        />
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground uppercase text-center">
                                            {lpjFile ? lpjFile.name : "Upload LPJ"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">New Workers</h3>
                                    <p className="text-xs text-muted-foreground">Required if there are new employees this month.</p>
                                </div>
                                <Button onClick={addEmployee} size="sm" variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100">
                                    <Plus className="mr-1 h-3 w-3" /> Add Worker
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {newEmployees.map((emp, index) => (
                                    <Card key={emp.tempId} className="relative bg-muted/30">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeEmployee(emp.tempId)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Worker National ID (NIK)</Label>
                                                    <Input
                                                        placeholder="16 digit NIK"
                                                        value={emp.nik}
                                                        onChange={(e) => updateEmployee(emp.tempId, { nik: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Full Name</Label>
                                                    <Input
                                                        placeholder="Name"
                                                        value={emp.name}
                                                        onChange={(e) => updateEmployee(emp.tempId, { name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Gender</Label>
                                                    <Select value={emp.gender} onValueChange={(v: any) => updateEmployee(emp.tempId, { gender: v })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="M">Male</SelectItem>
                                                            <SelectItem value="F">Female</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Worker Status</Label>
                                                    <Select value={emp.employmentStatus} onValueChange={(v: any) => updateEmployee(emp.tempId, { employmentStatus: v })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="FULL_TIME">Full-time</SelectItem>
                                                            <SelectItem value="PART_TIME">Part-time</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Role</Label>
                                                    <Input
                                                        value={emp.role}
                                                        onChange={(e) => updateEmployee(emp.tempId, { role: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 border-t pt-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase font-bold">KTP File *</Label>
                                                    <div className="border border-dashed rounded p-1 flex items-center justify-center h-8 relative">
                                                        <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateEmployee(emp.tempId, { idCardFile: e.target.files?.[0] || null })} />
                                                        <span className="text-[9px] truncate px-2">{emp.idCardFile ? emp.idCardFile.name : "Select File"}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase font-bold">Salary Slip *</Label>
                                                    <div className="border border-dashed rounded p-1 flex items-center justify-center h-8 relative">
                                                        <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateEmployee(emp.tempId, { salarySlipFile: e.target.files?.[0] || null })} />
                                                        <span className="text-[9px] truncate px-2">{emp.salarySlipFile ? emp.salarySlipFile.name : "Select File"}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase font-bold">BPJS (Optional)</Label>
                                                    <div className="border border-dashed rounded p-1 flex items-center justify-center h-8 relative">
                                                        <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateEmployee(emp.tempId, { bpjsCardFile: e.target.files?.[0] || null })} />
                                                        <span className="text-[9px] truncate px-2">{emp.bpjsCardFile ? emp.bpjsCardFile.name : "Select File"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {newEmployees.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                                        <p className="text-sm text-muted-foreground">Tidak ada penambahan tenaga kerja baru bulan ini.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    {currentStep < steps.length ? (
                        <Button
                            onClick={handleNext}
                            className="bg-indigo-600 hover:bg-indigo-700"
                            disabled={currentStep === 1 && (!participantId || !reportMonth || !revenue || !salesVolume)}
                        >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleSaveOutput}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Save Report</>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
