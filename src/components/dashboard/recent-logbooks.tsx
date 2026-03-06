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
        method: "Face-to-Face",
    },
    // ...
]

const recentApprovals = [
    {
        id: "1",
        date: "2026-03-05",
        user: "Budi Pratama",
        description: "UI Univ Admin Registration",
        status: "Pending",
    },
    {
        id: "2",
        date: "2026-03-04",
        user: "Siska Amelia",
        description: "Central Supervisor Registration",
        status: "Done",
    },
]

export function RecentLogbooks() {
    const { role } = useRole()

    if (role === "super_admin") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Latest User Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Description</TableHead>
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
                                        <Badge variant={app.status === "Done" ? "default" : "secondary"}>
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
                <CardTitle>Recent Logbooks</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Participants</TableHead>
                            <TableHead>Topic</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logbooks.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{log.date}</TableCell>
                                <TableCell>
                                    <Badge variant={log.method === "Face-to-Face" ? "default" : "secondary"}>
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
