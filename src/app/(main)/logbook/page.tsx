"use client"

import * as React from "react"
import { Plus, MoreHorizontal, FileEdit, Trash2, Home, Laptop } from "lucide-react"
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

type LogbookEntry = {
    id: string
    date: string
    method: "FACE_TO_FACE" | "ONLINE"
    participantsCount: string
    topic: string
    summary: string
}

const logbooks: LogbookEntry[] = [
    {
        id: "LOG001",
        date: "2026-03-05",
        method: "FACE_TO_FACE",
        participantsCount: "3 orang",
        topic: "Business Model Canvas (BMC)",
        summary: "Pembahasan 9 blok BMC untuk usaha kuliner...",
    },
    {
        id: "LOG002",
        date: "2026-03-03",
        method: "ONLINE",
        participantsCount: "1 orang",
        topic: "Manajemen Kasir Digital",
        summary: "Implementasi aplikasi kasir untuk pencatatan...",
    },
    {
        id: "LOG003",
        date: "2026-03-01",
        method: "FACE_TO_FACE",
        participantsCount: "2 orang",
        topic: "Strategi Produk & Branding",
        summary: "Re-design logo dan perbaikan kemasan...",
    },
    {
        id: "LOG004",
        date: "2026-02-28",
        method: "ONLINE",
        participantsCount: "5 orang",
        topic: "Legalitas Usaha (NIB)",
        summary: "Pendampingan pembuatan NIB melalui OSS...",
    },
]

export default function LogbookPage() {
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <FileEdit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                data={logbooks}
                searchPlaceholder="Search topic or participant..."
                filters={filters}
                totalItems={34} // Mock total
            />
        </div>
    )
}
