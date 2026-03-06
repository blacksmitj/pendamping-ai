"use client"

import * as React from "react"
import { Plus, MoreHorizontal, FileEdit, Trash2, TrendingUp, Users2 } from "lucide-react"
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

type OutputReport = {
    id: string
    month: string
    participantName: string
    revenue: string
    newEmployees: string
    status: "Verified" | "Submitted" | "Draft"
}

const reports: OutputReport[] = [
    {
        id: "REP001",
        month: "March 2026",
        participantName: "Ahmad Rifai",
        revenue: "Rp 15.000.000",
        newEmployees: "2 new people",
        status: "Draft",
    },
    {
        id: "REP002",
        month: "February 2026",
        participantName: "Budi Santoso",
        revenue: "Rp 8.200.000",
        newEmployees: "0 new people",
        status: "Submitted",
    },
    {
        id: "REP003",
        month: "February 2026",
        participantName: "Citra Kusuma",
        revenue: "Rp 12.500.000",
        newEmployees: "1 new person",
        status: "Verified",
    },
]

export default function CapaianOutputPage() {
    const columns = [
        { header: "Month", accessor: "month" as keyof OutputReport, className: "font-medium" },
        { header: "Participant", accessor: "participantName" as keyof OutputReport },
        {
            header: "Revenue",
            accessor: "revenue" as keyof OutputReport,
            cell: (r: OutputReport) => (
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span>{r.revenue}</span>
                </div>
            ),
        },
        {
            header: "New Employees",
            accessor: "newEmployees" as keyof OutputReport,
            cell: (r: OutputReport) => (
                <div className="flex items-center gap-2">
                    <Users2 className="h-3 w-3 text-indigo-500" />
                    <span>{r.newEmployees}</span>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: "status" as keyof OutputReport,
            cell: (r: OutputReport) => {
                let badgeClass = ""
                let statusLabel = ""
                switch (r.status) {
                    case "Verified":
                        badgeClass = "bg-emerald-500 hover:bg-emerald-600 text-white"
                        statusLabel = "Verified"
                        break
                    case "Submitted":
                        badgeClass = "bg-slate-500 hover:bg-slate-600 text-white"
                        statusLabel = "Submitted"
                        break
                    case "Draft":
                        badgeClass = "border-slate-300 text-slate-600"
                        statusLabel = "Draft"
                        break
                }
                return (
                    <Badge variant={r.status === "Draft" ? "outline" : "default"} className={badgeClass}>
                        {statusLabel}
                    </Badge>
                )
            },
        },
        {
            header: "Action",
            className: "text-right",
            cell: (r: OutputReport) => (
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
            <Link href="/output/create">
                <Plus className="mr-2 h-4 w-4" /> Create New Report
            </Link>
        </Button>
    )

    const filters = (
        <>
            <Button variant="outline">Filter Month</Button>
            <Button variant="outline">Filter Status</Button>
        </>
    )

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Output Report"
                description="Monthly output report (revenue, transaction volume, new employees)."
                action={actionButton}
            />

            <DataTable
                columns={columns}
                data={reports}
                searchPlaceholder="Search participant name or month..."
                filters={filters}
            />
        </div>
    )
}
