"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, Save, Users, Loader2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"

export default function AssignParticipantsPage() {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const [selectedParticipants, setSelectedParticipants] = React.useState<string[]>([])
    const [selectedMentor, setSelectedMentor] = React.useState<string>("")

    const { data: participants, isLoading: isLoadingParticipants } = useQuery({
        queryKey: ["participants", "unassigned"],
        queryFn: async () => {
            const url = new URL("/api/participants", window.location.origin)
            url.searchParams.append("unassigned", "true")
            if ((session?.user as any)?.universityId) {
                url.searchParams.append("universityId", (session?.user as any).universityId)
            }
            const res = await fetch(url.toString())
            if (!res.ok) throw new Error("Failed to fetch unassigned participants")
            return res.json()
        },
        enabled: !!session?.user,
    })

    const { data: mentors, isLoading: isLoadingMentors } = useQuery({
        queryKey: ["users", "mentors"],
        queryFn: async () => {
            const url = new URL("/api/users", window.location.origin)
            url.searchParams.append("role", "MENTOR")
            if ((session?.user as any)?.universityId) {
                url.searchParams.append("universityId", (session?.user as any).universityId)
            }
            const res = await fetch(url.toString())
            if (!res.ok) throw new Error("Failed to fetch mentors")
            return res.json()
        },
        enabled: !!session?.user,
    })

    const assignMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/participants/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    participantIds: selectedParticipants,
                    mentorId: selectedMentor,
                }),
            })
            if (!res.ok) throw new Error("Failed to assign participants")
            return res.json()
        },
        onSuccess: () => {
            toast.success("Berhasil memploting peserta!")
            queryClient.invalidateQueries({ queryKey: ["participants", "unassigned"] })
            setSelectedParticipants([])
            setSelectedMentor("")
        },
        onError: (error) => {
            toast.error(error.message || "Gagal memploting peserta")
        }
    })

    const toggleParticipant = (id: string) => {
        setSelectedParticipants(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const getInitials = (name: string) => {
        return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
    }

    const columns: any[] = [
        {
            id: "select",
            header: "Pilih",
            cell: (item: any) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={selectedParticipants.includes(item.id)}
                        onCheckedChange={() => toggleParticipant(item.id)}
                        className="h-5 w-5 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                </div>
            ),
        },
        {
            header: "Peserta",
            accessor: "fullName",
            cell: (item: any) => {
                const name = item.fullName || item.name || "No Name"
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 text-xs font-bold ring-1 ring-white">
                                {getInitials(name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 leading-none mb-1">{name}</span>
                            <span className="text-xs text-slate-500 font-medium">{item.businessSector || "Belum ada sektor"}</span>
                        </div>
                    </div>
                )
            }
        },
        {
            header: "Identitas",
            accessor: "tkmId",
            cell: (item: any) => (
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase mb-0.5">TKM ID</span>
                    <code className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                        {item.tkmId || "N/A"}
                    </code>
                </div>
            )
        },
        {
            header: "Status",
            id: "status",
            cell: () => (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-amber-100/50 bg-amber-50 text-amber-700 text-[10px] font-bold tracking-tight shadow-sm uppercase">
                    <Loader2 className="h-3 w-3" />
                    Belum Terplotting
                </div>
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
                        data={participants || []}
                        searchPlaceholder="Cari peserta..."
                        isLoading={isLoadingParticipants}
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
                                <Select value={selectedMentor} onValueChange={setSelectedMentor} disabled={isLoadingMentors}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Pendamping" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mentors?.map((m: any) => (
                                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                disabled={selectedParticipants.length === 0 || !selectedMentor || assignMutation.isPending}
                                onClick={() => assignMutation.mutate()}
                            >
                                {assignMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Simpan Plotting
                            </Button>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    Peserta akan langsung terhubung dengan mentor.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
