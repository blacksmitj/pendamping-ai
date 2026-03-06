"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, ArrowRight, Save, Users } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const participants = [
    { id: "T001", name: "Ahmad Rifai", sector: "Kuliner", status: "Belum Terassign" },
    { id: "T002", name: "Budi Santoso", sector: "Jasa", status: "Belum Terassign" },
    { id: "T003", name: "Citra Lestari", sector: "Fashion", status: "Belum Terassign" },
    { id: "T004", name: "Deni Ramdani", sector: "Kuliner", status: "Belum Terassign" },
    { id: "T005", name: "Eka Sari", sector: "Fashion", status: "Belum Terassign" },
]

const mentors = [
    { id: "M001", name: "Dr. Budi Santoso" },
    { id: "M003", name: "Hendra Pratama" },
]

export default function AssignParticipantsPage() {
    const [selectedParticipants, setSelectedParticipants] = React.useState<string[]>([])
    const [selectedMentor, setSelectedMentor] = React.useState<string>("")

    const toggleParticipant = (id: string) => {
        setSelectedParticipants(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const columns: any[] = [
        {
            id: "select",
            header: "Pilih",
            cell: (item: any) => (
                <Checkbox
                    checked={selectedParticipants.includes(item.id)}
                    onCheckedChange={() => toggleParticipant(item.id)}
                />
            ),
        },
        {
            header: "Nama Peserta",
            accessor: "name",
            cell: (item: any) => <span className="font-medium">{item.name}</span>
        },
        {
            header: "ID",
            accessor: "id",
        },
        {
            header: "Sektor",
            accessor: "sector",
        },
        {
            header: "Status",
            accessor: "status",
            cell: (item: any) => (
                <Badge variant="outline" className="text-slate-500 italic">
                    {item.status}
                </Badge>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Plotting Peserta"
                description="Assign peserta yang belum memiliki pendamping ke pembimbing yang tersedia."
            />

            <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <DataTable
                        columns={columns}
                        data={participants}
                        searchPlaceholder="Cari peserta..."
                    />
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-indigo-600" />
                                Action Plotting
                            </CardTitle>
                            <CardDescription>
                                {selectedParticipants.length} Peserta terpilih
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pilih Pendamping</label>
                                <Select onValueChange={setSelectedMentor}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Pendamping" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mentors.map(m => (
                                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                disabled={selectedParticipants.length === 0 || !selectedMentor}
                            >
                                <Save className="mr-2 h-4 w-4" /> Simpan Plotting
                            </Button>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    Peserta akan mendapatkan notifikasi setelah diassign.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
