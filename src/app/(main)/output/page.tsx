"use client"

import * as React from "react"
import { Plus, MoreHorizontal, FileEdit, Trash2, TrendingUp, Users2, Eye } from "lucide-react"
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

type OutputReport = {
    id: string
    month: string
    participantName: string
    revenue: string
    newEmployees: string
    status: "Verified" | "Submitted" | "Draft" | "REVISION" | "APPROVED" | "REJECTED" | "SUBMITTED" | "DRAFT"
}

export default function CapaianOutputPage() {
    const { data: entries = [], isLoading } = useQuery({
        queryKey: ["outputs"],
        queryFn: async () => {
            const res = await fetch("/api/outputs")
            if (!res.ok) throw new Error("Gagal mengambil data output")
            const data = await res.json()
            return data.map((out: any) => ({
                id: out.id,
                month: new Date(out.reportMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                participantName: out.participant?.fullName || "Unknown",
                revenue: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(out.revenue)),
                newEmployees: `${out.employees?.length || 0} orang`,
                status: out.reviewStatus,
            }))
        }
    })

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
                    case "APPROVED":
                    case "Verified":
                        badgeClass = "bg-emerald-500 hover:bg-emerald-600 text-white"
                        statusLabel = "Approved"
                        break
                    case "SUBMITTED":
                    case "Submitted":
                        badgeClass = "bg-slate-500 hover:bg-slate-600 text-white"
                        statusLabel = "Submitted"
                        break
                    case "DRAFT":
                    case "Draft":
                        badgeClass = "border-slate-300 text-slate-600"
                        statusLabel = "Draft"
                        break
                    case "REVISION":
                        badgeClass = "bg-amber-500 hover:bg-amber-600 text-white"
                        statusLabel = "Revision"
                        break
                    case "REJECTED":
                        badgeClass = "bg-rose-500 hover:bg-rose-600 text-white"
                        statusLabel = "Rejected"
                        break
                }
                return (
                    <Badge variant={r.status === "Draft" || r.status === "DRAFT" ? "outline" : "default"} className={badgeClass}>
                        {statusLabel}
                    </Badge>
                )
            },
        },
        {
            header: "Action",
            className: "text-right",
            cell: (r: OutputReport) => (
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/output/${r.id}`}>
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
                                <Link href={`/output/${r.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Detail
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/output/${r.id}/edit`}>
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
                data={entries}
                searchPlaceholder="Search participant name or month..."
                filters={filters}
                isLoading={isLoading}
            />
        </div>
    )
}
