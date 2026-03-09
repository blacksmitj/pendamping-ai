"use client"

import * as React from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Save } from "lucide-react"

interface WorkspaceSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    workspace?: {
        id: string
        name: string
        startDate: string | Date
        endDate: string | Date
        description?: string | null
    }
}

export function WorkspaceSheet({
    open,
    onOpenChange,
    workspace
}: WorkspaceSheetProps) {
    const [isSaving, setIsSaving] = React.useState(false)
    const [formData, setFormData] = React.useState({
        name: "",
        startDate: "",
        endDate: "",
        description: ""
    })

    React.useEffect(() => {
        if (workspace) {
            setFormData({
                name: workspace.name,
                startDate: new Date(workspace.startDate).toISOString().split('T')[0],
                endDate: new Date(workspace.endDate).toISOString().split('T')[0],
                description: workspace.description || ""
            })
        } else {
            setFormData({
                name: "",
                startDate: "",
                endDate: "",
                description: ""
            })
        }
    }, [workspace, open])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSaving(true)

            const data = {
                name: formData.name,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                description: formData.description
            }

            if (workspace) {
                await fetch(`/api/workspaces?id=${workspace.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
            } else {
                await fetch("/api/workspaces", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
            }

            onOpenChange(false)
        } catch (error) {
            console.error("Failed to save workspace:", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[425px] w-full p-0 flex flex-col">
                <form onSubmit={handleSave} className="flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle>{workspace ? "Edit Workspace" : "Workspace Baru"}</SheetTitle>
                        <SheetDescription>
                            {workspace
                                ? "Perbarui informasi workspace yang sudah ada."
                                : "Buat workspace baru untuk periode pendampingan mendatang."
                            }
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Workspace</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: TKM Lanjutan 2025"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startDate">Tanggal Mulai</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endDate">Tanggal Selesai</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi (Opsional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Keterangan tambahan mengenai workspace ini..."
                            />
                        </div>
                    </div>

                    <SheetFooter className="border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700">
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    {workspace ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                    {workspace ? "Simpan Perubahan" : "Buat Workspace"}
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
