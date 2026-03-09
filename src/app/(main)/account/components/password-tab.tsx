"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function PasswordTab() {
    const [currentPassword, setCurrentPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")

    const changePasswordMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/account?action=password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(errorText || "Gagal mengubah kata sandi")
            }
            return res.text()
        },
        onSuccess: () => {
            toast.success("Kata sandi berhasil diubah")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        },
        onError: (error: any) => {
            toast.error(error.message || "Gagal mengubah kata sandi")
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error("Konfirmasi password tidak cocok")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Password baru minimal 8 karakter")
            return
        }

        changePasswordMutation.mutate({ currentPassword, newPassword })
    }

    const isPending = changePasswordMutation.isPending

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-rose-500" />
                        Keamanan Akun
                    </CardTitle>
                    <CardDescription>Ganti kata sandi Anda secara berkala untuk menjaga keamanan akun.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPass" className="text-sm font-semibold">Password Saat Ini</Label>
                            <Input
                                id="oldPass"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="focus-visible:ring-rose-500"
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="newPass" className="text-sm font-semibold">Password Baru</Label>
                                <Input
                                    id="newPass"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="focus-visible:ring-rose-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPass" className="text-sm font-semibold">Konfirmasi Password Baru</Label>
                                <Input
                                    id="confirmPass"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="focus-visible:ring-rose-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 shadow-sm">
                            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-amber-600" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold">Penting!</p>
                                <p className="text-xs leading-relaxed">
                                    Setelah mengganti kata sandi, Anda akan diminta untuk login kembali di semua perangkat yang terhubung untuk memastikan keamanan.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                            <p className="text-xs font-bold text-slate-700">Persyaratan Password:</p>
                            <ul className="space-y-1.5">
                                <li className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className={`h-3.5 w-3.5 ${newPassword.length >= 8 ? "text-green-500" : "text-slate-300"}`} />
                                    Minimal 8 karakter
                                </li>
                                <li className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className={`h-3.5 w-3.5 ${newPassword !== "" && newPassword === confirmPassword ? "text-green-500" : "text-slate-300"}`} />
                                    Password cocok dengan konfirmasi
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end bg-slate-50/50 border-t px-6 py-4">
                    <Button
                        type="submit"
                        variant="outline"
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-semibold"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Ubah Password
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
