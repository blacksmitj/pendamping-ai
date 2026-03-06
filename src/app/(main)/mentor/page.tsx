"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Users,
    BookOpen,
    Award,
    GraduationCap,
    MapPin,
    Mail,
    Phone
} from "lucide-react"

const mockPendamping = {
    name: "Rizky Ramadhan",
    university: "Universitas Padjadjaran",
    region: "Kota Bandung",
    totalParticipants: 15,
    totalLogbooks: 24,
    outputs: "12/15",
    jpl: 180,
    email: "rizky.r@unpad.ac.id",
    phone: "0812-3456-7890",
}

const participants = [
    { id: "T001", name: "Ahmad Rifai", sector: "Kuliner", status: "Aktif" },
    { id: "T005", name: "Eka Sari", sector: "Fashion", status: "Aktif" },
    { id: "T009", name: "Irfan Hakim", sector: "Jasa", status: "Aktif" },
    { id: "T012", name: "Lina Marlina", sector: "Kuliner", status: "Aktif" },
]

export default function PendampingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Mentor Profile</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Profile Card */}
                <Card className="lg:col-span-4">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-indigo-100 p-1">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>RR</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold">{mockPendamping.name}</h2>
                        <Badge variant="secondary" className="mt-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Senior Mentor</Badge>

                        <div className="w-full mt-6 space-y-4 text-sm text-left border-t pt-6">
                            <div className="flex items-center gap-3">
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                <span>{mockPendamping.university}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{mockPendamping.region}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{mockPendamping.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{mockPendamping.phone}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats & Binaan */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Total Participant</p>
                                <div className="text-2xl font-bold flex items-center justify-center gap-2">
                                    <Users className="h-5 w-5 text-indigo-500" />
                                    {mockPendamping.totalParticipants}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Logbook</p>
                                <div className="text-2xl font-bold flex items-center justify-center gap-2">
                                    <BookOpen className="h-5 w-5 text-emerald-500" />
                                    {mockPendamping.totalLogbooks}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Study Hours</p>
                                <div className="text-2xl font-bold flex items-center justify-center gap-2">
                                    <Award className="h-5 w-5 text-amber-500" />
                                    {mockPendamping.jpl}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg">Mentored Participants</CardTitle>
                                <CardDescription>List of participants mentored by you.</CardDescription>
                            </div>
                            <Badge variant="outline">{mockPendamping.totalParticipants} Total</Badge>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Sector</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {participants.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{p.name}</TableCell>
                                            <TableCell>{p.sector}</TableCell>
                                            <TableCell>
                                                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">
                                                    {p.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
