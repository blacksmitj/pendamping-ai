"use client"

import * as React from "react"
import { Plus, MoreHorizontal, FileEdit, Trash2, Home, Laptop, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { useQuery } from "@tanstack/react-query"

type LogbookEntry = {
    id: string
    date: string
    method: "FACE_TO_FACE" | "ONLINE"
    participantsCount: string
    topic: string
    summary: string
}

export default function LogbookPage() {
    const { data: entries = [], isLoading } = useQuery({
        queryKey: ["logbooks"],
        queryFn: async () => {
            const res = await fetch("/api/logbooks")
            if (!res.ok) throw new Error("Gagal mengambil data logbook")
            const data = await res.json()
            return data.map((log: any) => ({
                id: log.id,
                date: new Date(log.date).toISOString().split("T")[0],
                method: log.deliveryMethod,
                participantsCount: `${log.logbookParticipants?.length || 0} orang`,
                topic: log.material,
                summary: log.summary,
            }))
        }
    })

    const columns = [
        { header: "Date", accessor: "date" as keyof LogbookEntry, className: "font-medium" },
        {
            header: "Method",
            accessor: "method" as keyof LogbookEntry,
            cell: (log: LogbookEntry) => (
                <div className="flex items-center gap-2">
                    {log.method === "FACE_TO_FACE" ? (
                        <Home className="h-3 w-3 text-indigo-500" />
                    ) : (
                        <Laptop className="h-3 w-3 text-emerald-500" />
                    )}
                    <Badge variant="secondary">
                        {log.method === "FACE_TO_FACE" ? "Face-to-Face" : "Online"}
                    </Badge>
                </div>
            ),
        },
        { header: "Participant", accessor: "participantsCount" as keyof LogbookEntry },
        { header: "Topic", accessor: "topic" as keyof LogbookEntry, className: "font-medium" },
        {
            header: "Summary",
            accessor: "summary" as keyof LogbookEntry,
            className: "max-w-[300px]",
            cell: (log: LogbookEntry) => (
                <span className="text-muted-foreground truncate block max-w-[300px]">
                    {log.summary}
                </span>
            ),
        },
        {
            header: "Action",
            className: "text-right",
            cell: (log: LogbookEntry) => (
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/logbook/${log.id}`}>
                            <Eye className="h-4 w-4 text-indigo-600" />
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/logbook/${log.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Detail
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/logbook/${log.id}/edit`}>
                                    <FileEdit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ]


    const actionButton = (
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/logbook/create">
                <Plus className="mr-2 h-4 w-4" /> Create New Logbook
            </Link>
        </Button>
    )

    const filters = (
        <>
            <Button variant="outline">Filter Month</Button>
            <Button variant="outline">Filter Method</Button>
        </>
    )

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Logbook"
                description="List of daily mentoring activity reports."
                action={actionButton}
            />

            <DataTable
                columns={columns}
                data={entries}
                searchPlaceholder="Search topic or participant..."
                filters={filters}
                isLoading={isLoading}
            />
        </div>
    )
}
