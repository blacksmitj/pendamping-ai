"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User as UserIcon, Loader2 } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getStorageUrl } from "@/lib/storage-helper"
import { uploadFileToMinio } from "@/lib/storage-client"

export function ProfileTab() {
    const { data: session, isPending: sessionPending } = useSession()
    const queryClient = useQueryClient()
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const [name, setName] = React.useState("")

    React.useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name)
        }
    }, [session])

    const updateProfileMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/account?action=profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(errorText || "Gagal memperbarui profil")
            }
            return res.text()
        },
        onSuccess: () => {
            toast.success("Profil berhasil diperbarui")
            queryClient.invalidateQueries({ queryKey: ["session"] })
        },
        onError: (error: any) => {
            toast.error(error.message || "Gagal memperbarui profil")
        }
    })

    const uploadAvatarMutation = useMutation({
        mutationFn: async (file: File) => {
            const path = await uploadFileToMinio(file, "avatar")
            const res = await fetch("/api/account?action=profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: session?.user?.name || "", image: path }),
            })
            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(errorText || "Gagal memperbarui profil")
            }
            return res.text()
        },
        onSuccess: () => {
            toast.success("Foto profil berhasil diperbarui")
            queryClient.invalidateQueries({ queryKey: ["session"] })
        },
        onError: (error: any) => {
            toast.error(error.message || "Gagal mengunggah foto profil")
        }
    })

    if (sessionPending) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
    }

    const handleSave = () => {
        updateProfileMutation.mutate({ name })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            uploadAvatarMutation.mutate(file)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-indigo-600" />
                    Profil Pengguna
                </CardTitle>
                <CardDescription>Perbarui informasi profil dan identitas login Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 border-4 border-indigo-50 shadow-sm">
                            <AvatarImage src={getStorageUrl(session?.user?.image)} className="object-cover" />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xl">
                                {session?.user?.name?.substring(0, 2).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="text-white h-6 w-6" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-slate-900">{session?.user?.name}</h3>
                        <p className="text-sm text-slate-500">{session?.user?.email}</p>
                        <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600 mt-1">{(session?.user as any)?.role?.replace("_", " ")}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 text-xs h-8"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadAvatarMutation.isPending}
                        >
                            {uploadAvatarMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Camera className="h-3 w-3 mr-2" />}
                            Ganti Foto Profil
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">Nama Lengkap</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="focus-visible:ring-indigo-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">Alamat Email</Label>
                        <Input id="email" value={session?.user?.email} disabled className="bg-slate-50 border-slate-200" />
                        <p className="text-[11px] text-slate-500 italic">Email tidak dapat diubah oleh pengguna.</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-end bg-slate-50/50 border-t px-6 py-4">
                <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending || name === session?.user?.name}
                >
                    {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Simpan Perubahan
                </Button>
            </CardFooter>
        </Card>
    )
}
