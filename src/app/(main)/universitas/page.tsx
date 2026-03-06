"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Building2, MapPin, CheckCircle, Users } from "lucide-react"

const mockUniversity = {
    name: "Universitas Padjadjaran",
    city: "Bandung",
    address: "Jl. Dipati Ukur No. 35, Bandung",
    status: "Aktif",
    totalMentors: 5,
}

const mentorList = [
    { name: "Rizky Ramadhan", region: "Kota Bandung", participants: 15, logbooks: 24 },
    { name: "Siti Aminah", region: "Kab. Bandung", participants: 12, logbooks: 18 },
    { name: "Dewa Made", region: "Kota Bandung", participants: 10, logbooks: 15 },
    { name: "Budi Kurniawan", region: "Cimahi", participants: 8, logbooks: 10 },
    { name: "Lina Marlina", region: "Kab. Bandung Barat", participants: 7, logbooks: 9 },
]

export default function UniversitasPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Universitas</h1>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="h-14 w-14 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            <Building2 className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-2xl">{mockUniversity.name}</CardTitle>
                                <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                    <CheckCircle className="mr-1 h-3 w-3" /> {mockUniversity.status}
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3" /> {mockUniversity.city} • {mockUniversity.address}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Pendamping</p>
                            <div className="text-3xl font-bold text-indigo-600 flex items-center justify-end gap-2">
                                <Users className="h-6 w-6" /> {mockUniversity.totalMentors}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Daftar Pendamping Terkait</CardTitle>
                        <CardDescription>Semua pendamping yang terdaftar di bawah universitas ini.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Pendamping</TableHead>
                                    <TableHead>Wilayah Pendampingan</TableHead>
                                    <TableHead className="text-center">Total Peserta</TableHead>
                                    <TableHead className="text-center">Total Logbook</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mentorList.map((p, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.region}</TableCell>
                                        <TableCell className="text-center">{p.participants}</TableCell>
                                        <TableCell className="text-center">{p.logbooks}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
