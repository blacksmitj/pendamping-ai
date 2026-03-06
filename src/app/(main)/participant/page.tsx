"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileUp, MoreHorizontal, Eye, UserX, UserCheck, Loader2 } from "lucide-react"

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
import { getParticipants } from "@/actions/participants"

type Participant = {
    id: string
    tkmId: string
    name: string
    sector: string
    city: string
    status: string
}

export default function ParticipantsPage() {
    const router = useRouter()
    const [participants, setParticipants] = React.useState<Participant[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const data = await getParticipants()
                const mapped = data.map(p => ({
                    id: p.id,
                    tkmId: p.tkmId,
                    name: p.fullName,
                    sector: p.businessSector || "-",
                    city: p.businessCity || "-",
                    status: p.status === "active" ? "Active" : "Dropped",
                }))
                setParticipants(mapped)
            } finally {
                setLoading(false)
            }
        }
        fetchParticipants()
    }, [])

    const columns = [
        { header: "TKM ID", accessor: "tkmId" as keyof Participant, className: "w-[120px] font-medium" },
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

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={participants}
                    searchPlaceholder="Search name or TKM ID..."
                    filters={filters}
                    totalItems={participants.length}
                    onRowClick={(p) => router.push(`/participant/${p.id}`)}
                />
            )}
        </div>
    )
}

