"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Users,
    BookUser,
    GraduationCap,
    Book,
    LineChart,
    Settings,
    User,
    CheckSquare,
    ClipboardCheck,
    Monitor,
    Building2,
    Users2,
    Briefcase,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { useRole } from "@/components/providers/role-provider"
import { RoleSwitcher } from "@/components/role-switcher"

// Define menus for each role
const menus = {
    pendamping: [
        {
            title: "Main Menu",
            items: [
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
                { title: "Peserta", url: "/peserta", icon: Users },
                { title: "Logbook", url: "/logbook", icon: Book },
                { title: "Capaian Output", url: "/capaian-output", icon: LineChart },
            ],
        },
        {
            title: "System",
            items: [
                { title: "Pengaturan", url: "/pengaturan", icon: Settings },
                { title: "Akun", url: "/akun", icon: User },
            ],
        },
    ],
    admin_univ: [
        {
            title: "Main Menu",
            items: [
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
                { title: "Peserta", url: "/peserta", icon: Users },
                { title: "Pendamping", url: "/pendamping", icon: BookUser },
            ],
        },
        {
            title: "Review",
            items: [
                { title: "Review Logbook", url: "/admin/logbook-review", icon: CheckSquare },
                { title: "Review Capaian", url: "/admin/capaian-review", icon: ClipboardCheck },
            ],
        },
        {
            title: "System",
            items: [
                { title: "Users", url: "/admin/users", icon: Users2 },
                { title: "Assign Peserta", url: "/admin/assign", icon: Briefcase },
                { title: "Pengaturan", url: "/pengaturan", icon: Settings },
                { title: "Akun", url: "/akun", icon: User },
            ],
        },
    ],
    pengawas: [
        {
            title: "Main Menu",
            items: [
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
                { title: "Universitas", url: "/pengawas/universitas", icon: Building2 },
            ],
        },
        {
            title: "Monitor",
            items: [
                { title: "Monitor Logbook", url: "/pengawas/logbook", icon: Monitor },
                { title: "Monitor Capaian", url: "/pengawas/capaian", icon: LineChart },
            ],
        },
        {
            title: "System",
            items: [
                { title: "Akun", url: "/akun", icon: User },
            ],
        },
    ],
    super_admin: [
        {
            title: "Main Menu",
            items: [
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
                { title: "Workspace", url: "/super/workspace", icon: Briefcase },
                { title: "Universitas", url: "/super/universitas", icon: Building2 },
            ],
        },
        {
            title: "Management",
            items: [
                { title: "User Approval", url: "/super/users", icon: Users2 },
                { title: "Bulk Assign", url: "/super/assign", icon: Users },
            ],
        },
        {
            title: "System",
            items: [
                { title: "Pengaturan", url: "/pengaturan", icon: Settings },
                { title: "Akun", url: "/akun", icon: User },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { role } = useRole()

    const navData = menus[role] || menus.pendamping

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                        <span className="font-bold">PA</span>
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">Pendamping AI</span>
                        <span className="text-xs text-muted-foreground">v0.1.0</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {navData.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive = pathname === item.url || pathname?.startsWith(item.url + "/")
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <RoleSwitcher />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    )
}
