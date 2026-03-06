"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Camera, Lock, User as UserIcon } from "lucide-react"

export default function AkunPage() {
    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Akun</h1>
            </div>

            <div className="grid gap-6">
                {/* Profile Card */}
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
                                <Avatar className="h-24 w-24 border-4 border-indigo-50">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>RR</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="text-white h-6 w-6" />
                                </div>
                            </div>
                            <div className="space-y-1 text-center sm:text-left">
                                <h3 className="text-lg font-semibold">Rizky Ramadhan</h3>
                                <p className="text-sm text-muted-foreground">rizky.r@unpad.ac.id</p>
                                <Button variant="outline" size="sm" className="mt-2 text-xs">Ganti Foto Profil</Button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nama Depan</Label>
                                <Input id="firstName" defaultValue="Rizky" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nama Belakang</Label>
                                <Input id="lastName" defaultValue="Ramadhan" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input id="email" defaultValue="rizky.r@unpad.ac.id" disabled />
                                <p className="text-[10px] text-muted-foreground">Email tidak dapat diubah oleh pengguna.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input id="phone" defaultValue="081234567890" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end bg-muted/20 border-t pt-6">
                        <Button className="bg-indigo-600">Simpan Profil</Button>
                    </CardFooter>
                </Card>

                {/* Security Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-rose-500" />
                            Keamanan
                        </CardTitle>
                        <CardDescription>Ganti kata sandi untuk melindungi akun Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="oldPass">Password Lama</Label>
                                <Input id="oldPass" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPass">Password Baru</Label>
                                <Input id="newPass" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPass">Konfirmasi Password Baru</Label>
                                <Input id="confirmPass" type="password" />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <p className="text-xs">
                                Setelah mengganti kata sandi, Anda akan diminta untuk login kembali di semua perangkat yang terhubung.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t pt-6">
                        <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700">Ubah Password</Button>
                    </CardFooter>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preferensi</CardTitle>
                        <CardDescription>Personalisasi pengalaman penggunaan aplikasi.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="font-medium text-sm">Notifikasi Email</p>
                                <p className="text-xs text-muted-foreground">Terima ringkasan mingguan kegiatan pendampingan.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="font-medium text-sm">Mode Gelap (Beta)</p>
                                <p className="text-xs text-muted-foreground">Aktifkan tampilan antarmuka berwarna gelap.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
