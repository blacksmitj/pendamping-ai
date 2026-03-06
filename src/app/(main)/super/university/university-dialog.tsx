"use client"

import * as React from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Field,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Building2, Upload, X, Loader2 } from "lucide-react"
import { createUniversity, updateUniversity } from "@/actions/university"
import { uploadFileToMinio } from "@/lib/storage-client"
import { getStorageUrl } from "@/lib/storage-helper"
import { toast } from "sonner"
import Image from "next/image"

const universitySchema = z.object({
    name: z.string().min(3, "Nama universitas minimal 3 karakter"),
    code: z.string().min(2, "Kode minimal 2 karakter"),
    city: z.string(),
    address: z.string(),
    province: z.string(),
    logoUrl: z.string(),
    workspaceId: z.string().min(1, "Workspace harus dipilih"),
    status: z.string(),
})

type UniversityFormValues = z.infer<typeof universitySchema>

interface UniversityDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    university?: any
    workspaces: any[]
    onSuccess: () => void
}

export function UniversityDialog({
    open,
    onOpenChange,
    university,
    workspaces,
    onSuccess
}: UniversityDialogProps) {
    const [isUploading, setIsUploading] = React.useState(false)
    const [logoPreview, setLogoPreview] = React.useState<string | null>(university?.logoUrl ? getStorageUrl(university.logoUrl) : null)
    const [submitting, setSubmitting] = React.useState(false)

    const form = useForm<UniversityFormValues>({
        resolver: zodResolver(universitySchema),
        defaultValues: {
            name: university?.name || "",
            code: university?.code || "",
            city: university?.city || "",
            address: university?.address || "",
            province: university?.province || "",
            logoUrl: university?.logoUrl || "",
            workspaceId: university?.workspaceId || (workspaces.length > 0 ? workspaces[0].id : ""),
            status: university?.status || "ACTIVE",
        }
    })

    React.useEffect(() => {
        if (open) {
            form.reset({
                name: university?.name || "",
                code: university?.code || "",
                city: university?.city || "",
                address: university?.address || "",
                province: university?.province || "",
                logoUrl: university?.logoUrl || "",
                workspaceId: university?.workspaceId || (workspaces.length > 0 ? workspaces[0].id : ""),
                status: university?.status || "ACTIVE",
            })
            setLogoPreview(university?.logoUrl ? getStorageUrl(university.logoUrl) : null)
        }
    }, [open, university, workspaces, form])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const path = await uploadFileToMinio(file, "photo")
            form.setValue("logoUrl", path)
            setLogoPreview(getStorageUrl(path))
            toast.success("Logo uploaded successfully")
        } catch (error: any) {
            toast.error(error.message || "An error occurred during upload")
        } finally {
            setIsUploading(false)
        }
    }

    const onSubmit: SubmitHandler<UniversityFormValues> = async (values) => {
        setSubmitting(true)
        try {
            if (university) {
                const res = await updateUniversity(university.id, values)
                if (res.success) {
                    toast.success("Universitas berhasil diperbarui")
                } else {
                    toast.error(res.error || "Gagal memperbarui universitas")
                }
            } else {
                const res = await createUniversity(values)
                if (res.success) {
                    toast.success("Universitas berhasil ditambahkan")
                } else {
                    toast.error(res.error || "Gagal menambahkan universitas")
                }
            }
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{university ? "Edit Universitas" : "Tambah Universitas"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="flex flex-col items-center gap-4 mb-4">
                            <div className="relative h-24 w-24 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                                {logoPreview ? (
                                    <>
                                        <Image
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            fill
                                            className="object-contain p-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLogoPreview(null)
                                                form.setValue("logoUrl", "")
                                            }}
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 border shadow-sm hover:bg-white"
                                        >
                                            <X className="h-3 w-3 text-slate-600" />
                                        </button>
                                    </>
                                ) : (
                                    <Building2 className="h-10 w-10 text-slate-300" />
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="cursor-pointer">
                                    <span className="text-xs font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                                        <Upload className="h-3 w-3" />
                                        {logoPreview ? "Ganti Logo" : "Upload Logo"}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <Field className="col-span-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Nama Universitas</FieldLabel>
                                        <Input id={field.name} placeholder="Contoh: Universitas Indonesia" {...field} aria-invalid={fieldState.invalid} />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="code"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Kode / Singkatan</FieldLabel>
                                        <Input id={field.name} placeholder="Contoh: UI" {...field} aria-invalid={fieldState.invalid} />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="status"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Aktif</SelectItem>
                                                <SelectItem value="INACTIVE">Non-Aktif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                        </div>

                        <Controller
                            control={form.control}
                            name="workspaceId"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Workspace Program</FieldLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Pilih workspace" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {workspaces.map((ws) => (
                                                <SelectItem key={ws.id} value={ws.id}>
                                                    {ws.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name="city"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Kota</FieldLabel>
                                        <Input id={field.name} placeholder="Bandung" {...field} aria-invalid={fieldState.invalid} />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="province"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Provinsi</FieldLabel>
                                        <Input id={field.name} placeholder="Jawa Barat" {...field} aria-invalid={fieldState.invalid} />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                        </div>

                        <Controller
                            control={form.control}
                            name="address"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Alamat Lengkap</FieldLabel>
                                    <Input id={field.name} placeholder="Jl. Raya..." {...field} aria-invalid={fieldState.invalid} />
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={submitting || isUploading}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {university ? "Simpan Perubahan" : "Tambah Universitas"}
                            </Button>
                        </DialogFooter>
                    </form>
            </DialogContent>
        </Dialog>
    )
}
