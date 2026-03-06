"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldPlus, Mail, Lock, User, School, BadgeCheck, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signUp } from "@/lib/auth-client"

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [role, setRole] = React.useState("")
    const [universityId, setUniversityId] = React.useState("")
    const [error, setError] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error: authError } = await signUp.email({
                email,
                password,
                name,
                // Passing custom fields to Better Auth (needs custom field mapping or manual update)
                // If not natively handled by signUp hook, we'd need a separate server action or 
                // better-auth plugin. For now we follow the plan:
                data: {
                    role: role.toUpperCase(),
                    universityId: universityId,
                    status: "PENDING",
                }
            } as any) // Type-casting as any because custom data might not be in the default type

            if (authError) {
                setError(authError.message || "Gagal mendaftar. Silakan coba lagi.")
            } else {
                router.push("/login?registered=true")
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem. Silakan coba lagi nanti.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-indigo-200 shadow-xl">
                    <ShieldPlus className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                        Daftar Baru
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        Bergabunglah sebagai mitra pendamping UMKM.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                    {error && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 font-medium">Nama Lengkap</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="name"
                                placeholder="Masukkan nama lengkap"
                                className="pl-10 h-11 border-slate-200 focus:border-indigo-500 transition-all"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-medium">Alamat Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10 h-11 border-slate-200 focus:border-indigo-500 transition-all"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-slate-700 font-medium">Role Anda</Label>
                            <Select required onValueChange={setRole} value={role} disabled={isLoading}>
                                <SelectTrigger id="role" className="h-11 border-slate-200">
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pendamping">Pendamping</SelectItem>
                                    <SelectItem value="admin_univ">Admin Universitas</SelectItem>
                                    <SelectItem value="pengawas">Pengawas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="univ" className="text-slate-700 font-medium">Universitas</Label>
                            <Select required onValueChange={setUniversityId} value={universityId} disabled={isLoading}>
                                <SelectTrigger id="univ" className="h-11 border-slate-200">
                                    <SelectValue placeholder="Pilih Univ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ui-id">Universitas Indonesia</SelectItem>
                                    <SelectItem value="ugm-id">Universitas Gadjah Mada</SelectItem>
                                    <SelectItem value="itb-id">Institut Teknologi Bandung</SelectItem>
                                    <SelectItem value="unpad-id">Universitas Padjadjaran</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-700 font-medium">Kata Sandi</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 h-11 border-slate-200 focus:border-indigo-500 transition-all"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex items-start space-x-2 py-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                        <p className="text-xs text-slate-500">
                            Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-bold transition-all active:scale-[0.98]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mendaftar...
                            </>
                        ) : (
                            <>
                                Buat Akun Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-100" />
                    </div>
                </div>
                <p className="text-center text-sm text-slate-500">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                        Masuk Disini
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
