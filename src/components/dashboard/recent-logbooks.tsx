"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { useRole } from "@/components/providers/role-provider"

const logbooks = [
    {
        id: "1",
        date: "2026-03-05",
        participants: ["Ahmad R.", "Budi S."],
        topic: "Business Model Canvas",
        method: "Luring",
    },
    // ...
]

const recentApprovals = [
    {
        id: "A1",
        date: "2026-03-05",
        user: "Budi Pratama",
        description: "Pendaftaran Admin Univ UI",
        status: "Pending",
    },
    {
        id: "A2",
        date: "2026-03-04",
        user: "Siska Amelia",
        description: "Pendaftaran Pengawas Pusat",
        status: "Selesai",
    },
]

export function RecentLogbooks() {
    const { role } = useRole()

    if (role === "super_admin") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Persetujuan User Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentApprovals.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>{app.date}</TableCell>
                                    <TableCell className="font-medium">{app.user}</TableCell>
                                    <TableCell>{app.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={app.status === "Selesai" ? "default" : "secondary"}>
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Logbook Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Metode</TableHead>
                            <TableHead>Peserta</TableHead>
                            <TableHead>Materi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logbooks.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{log.date}</TableCell>
                                <TableCell>
                                    <Badge variant={log.method === "Luring" ? "default" : "secondary"}>
                                        {log.method}
                                    </Badge>
                                </TableCell>
                                <TableCell>{log.participants.join(", ")}</TableCell>
                                <TableCell>{log.topic}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
