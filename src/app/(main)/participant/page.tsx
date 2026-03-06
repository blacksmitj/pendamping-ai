"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileUp, MoreHorizontal, Eye, UserX, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"

type Participant = {
    id: string
    name: string
    sector: string
    city: string
    status: string
}

const participants: Participant[] = [
    { id: "T001", name: "Ahmad Rifai", sector: "Kuliner", city: "Bandung", status: "Active" },
    { id: "T002", name: "Budi Santoso", sector: "Fashion", city: "Jakarta", status: "Drop" },
    { id: "T003", name: "Citra Kusuma", sector: "Jasa", city: "Surabaya", status: "Active" },
    { id: "T004", name: "Dedi Prasetyo", sector: "Kriya", city: "Yogyakarta", status: "Active" },
    { id: "T005", name: "Eka Sari", sector: "Fashion", city: "Bandung", status: "Active" },
    { id: "T006", name: "Fatimah Zahra", sector: "Kuliner", city: "Medan", status: "Active" },
    { id: "T007", name: "Gunawan", sector: "Pertanian", city: "Semarang", status: "Drop" },
    { id: "T008", name: "Hanny L.", sector: "Jasa", city: "Denpasar", status: "Active" },
]

export default function ParticipantsPage() {
    const router = useRouter()

    const columns = [
        { header: "TKM ID", accessor: "id" as keyof Participant, className: "w-[100px] font-medium" },
        { header: "Name", accessor: "name" as keyof Participant },
        { header: "Sector", accessor: "sector" as keyof Participant },
        { header: "City", accessor: "city" as keyof Participant },
        {
            header: "Status",
            accessor: "status" as keyof Participant,
            cell: (p: Participant) => (
                <Badge
                    variant={p.status === "Active" ? "default" : "destructive"}
                    className={p.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                >
                    {p.status === "Active" ? "Active" : "Dropped"}
                </Badge>
            ),
        },
        {
            header: "Action",
            className: "text-right",
            cell: (p: Participant) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/participant/${p.id}`)
                        }}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {p.status === "Active" ? (
                            <DropdownMenuItem className="text-destructive">
                                <UserX className="mr-2 h-4 w-4" /> Mark as Dropped
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem className="text-emerald-600">
                                <UserCheck className="mr-2 h-4 w-4" /> Re-activate
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    const actionButton = (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <FileUp className="mr-2 h-4 w-4" /> Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Import Participant Data</DialogTitle>
                    <DialogDescription>
                        Upload Excel file (.xlsx or .csv) containing mentored participant data.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
                        <FileUp className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Click or drop file here</p>
                        <p className="text-xs text-muted-foreground">Max file size 5MB</p>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                        <p className="font-semibold mb-1">Notes:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Ensure Name, National ID, and Email columns are filled.</li>
                            <li>Use the provided Excel template.</li>
                            <li>Existing data will be updated based on National ID.</li>
                        </ul>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline">Download Template</Button>
                    <Button type="submit" disabled>Start Import</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    const filters = (
        <>
            <Button variant="outline">Filter Sektor</Button>
            <Button variant="outline">Filter Kota</Button>
        </>
    )

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Participants"
                description="Manage mentoring participant data and import from Excel."
                action={actionButton}
            />

            <DataTable
                columns={columns}
                data={participants}
                searchPlaceholder="Search name or TKM ID..."
                filters={filters}
                totalItems={45} // Mock total for pagination display
                onRowClick={(p) => router.push(`/participant/${p.id}`)}
            />
        </div>
    )
}
