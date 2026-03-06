"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "@/lib/auth-client"

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error: authError } = await signIn.email({
                email,
                password,
                callbackURL: "/dashboard",
            })

            if (authError) {
                setError(authError.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.")
            } else {
                router.push("/dashboard")
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem. Silakan coba lagi nanti.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-indigo-200 shadow-xl">
                    <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                        Selamat Datang
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        Masuk ke akun Anda untuk melanjutkan pendampingan.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
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
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-slate-700 font-medium">Kata Sandi</Label>
                            <Link href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                                Lupa sandi?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 h-11 border-slate-200 focus:border-indigo-500 transition-all"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                        >
                            Ingat saya di perangkat ini
                        </label>
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-bold transition-all active:scale-[0.98]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                Masuk Sekarang <ArrowRight className="ml-2 h-4 w-4" />
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
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-400">Atau</span>
                    </div>
                </div>
                <p className="text-center text-sm text-slate-500">
                    Belum punya akun?{" "}
                    <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-500">
                        Daftar Baru
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
