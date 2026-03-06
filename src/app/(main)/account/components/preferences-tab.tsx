"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Moon, Languages } from "lucide-react"

export function PreferencesTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                    Preferensi Aplikasi
                </CardTitle>
                <CardDescription>Personalisasi pengalaman penggunaan aplikasi Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <Bell className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-sm text-slate-900">Notifikasi Email</p>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                                Terima ringkasan mingguan kegiatan pendampingan dan update status logbook/output.
                            </p>
                        </div>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Moon className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-sm text-slate-900">Mode Gelap (Beta)</p>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                                Aktifkan tampilan antarmuka berwarna gelap untuk kenyamanan mata di malam hari.
                            </p>
                        </div>
                    </div>
                    <Switch className="data-[state=checked]:bg-indigo-600" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm opacity-60">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                            <Languages className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-slate-900">Bahasa</p>
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded uppercase">Segera</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                                Pilih bahasa yang ingin digunakan dalam aplikasi.
                            </p>
                        </div>
                    </div>
                    <div className="text-xs font-bold text-slate-400 pr-2">Bahasa Indonesia</div>
                </div>
            </CardContent>
        </Card>
    )
}
