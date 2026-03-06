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
import { Building2, MapPin, CheckCircle, Users, Loader2 } from "lucide-react"
import { getMyUniversity } from "@/actions/university"
import Image from "next/image"
import { getStorageUrl } from "@/lib/storage-helper"

export default function UniversitasPage() {
    const [university, setUniversity] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMyUniversity()
                setUniversity(data)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    if (!university) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Building2 className="h-16 w-16 text-slate-200" />
                <h2 className="text-xl font-semibold text-slate-900">Universitas Tidak Ditemukan</h2>
                <p className="text-slate-500">Anda tidak terasosiasi dengan universitas manapun.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">University</h1>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="h-14 w-14 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 overflow-hidden relative">
                            {university.logoUrl ? (
                                <Image 
                                    src={getStorageUrl(university.logoUrl)} 
                                    alt={university.name} 
                                    fill 
                                    className="object-contain p-2" 
                                />
                            ) : (
                                <Building2 className="h-8 w-8 text-indigo-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-2xl">{university.name}</CardTitle>
                                <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                    <CheckCircle className="mr-1 h-3 w-3" /> {university.status === "ACTIVE" ? "Terverifikasi" : "Pending"}
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3" /> {university.city} • {university.address}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Mentor</p>
                            <div className="text-3xl font-bold text-indigo-600 flex items-center justify-end gap-2">
                                <Users className="h-6 w-6" /> {university.users?.length || 0}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Related Mentor List</CardTitle>
                        <CardDescription>All mentors registered under this university.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mentor Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-center">Total Participant</TableHead>
                                    <TableHead className="text-center">Total Logbook</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {university.users?.map((mentor: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{mentor.name}</TableCell>
                                        <TableCell>{mentor.email}</TableCell>
                                        <TableCell className="text-center">{mentor._count?.assignments || 0}</TableCell>
                                        <TableCell className="text-center">{mentor._count?.logbooks || 0}</TableCell>
                                    </TableRow>
                                ))}
                                {(!university.users || university.users.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                            Belum ada mentor yang terdaftar.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
