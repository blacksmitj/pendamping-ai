"use client"

import * as React from "react"
import { ChevronsUpDown, ShieldAlert } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useRole, Role } from "@/components/providers/role-provider"

const roles: { value: Role; label: string; description: string }[] = [
    { value: "pendamping", label: "Pendamping", description: "Akses menu logbook" },
    { value: "admin_univ", label: "Admin Universitas", description: "Review laporan" },
    { value: "pengawas", label: "Pengawas", description: "Monitor progress" },
    { value: "super_admin", label: "Super Admin", description: "Akses penuh" },
]

export function RoleSwitcher() {
    const { isMobile } = useSidebar()
    const { role, setRole } = useRole()
    const activeRole = roles.find((r) => r.value === role) || roles[0]

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 border border-orange-200">
                                <ShieldAlert className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold uppercase text-xs text-orange-600">
                                    Dev Mode
                                </span>
                                <span className="truncate text-xs font-semibold">{activeRole.label}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Switch Dev Role
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {roles.map((r) => (
                            <DropdownMenuItem
                                key={r.value}
                                onClick={() => setRole(r.value)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    {r.value === role ? (
                                        <div className="size-2 rounded-full bg-indigo-600" />
                                    ) : null}
                                </div>
                                <div className="grid flex-1 leading-tight">
                                    <span className="truncate font-semibold">{r.label}</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {r.description}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
