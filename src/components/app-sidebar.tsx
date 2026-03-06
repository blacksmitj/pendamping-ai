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
    mentor: [
        {
            title: "Main Menu",
            items: [
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
                { title: "Participant", url: "/participant", icon: Users },
                { title: "Logbook", url: "/logbook", icon: Book },
                { title: "Output", url: "/output", icon: LineChart },
            ],
        },
        {
            title: "System",
            items: [
                { title: "Settings", url: "/settings", icon: Settings },
                { title: "Account", url: "/account", icon: User },
            ],
        },
    ],
    university_admin: [
        {
            title: "Main Menu",
            items: [
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
                { title: "Participant", url: "/participant", icon: Users },
                { title: "Mentor", url: "/mentor", icon: BookUser },
            ],
        },
        {
            title: "Review",
            items: [
                { title: "Logbook Review", url: "/admin/logbook-review", icon: CheckSquare },
                { title: "Output Review", url: "/admin/output-review", icon: ClipboardCheck },
            ],
        },
        {
            title: "System",
            items: [
                { title: "Users", url: "/admin/users", icon: Users2 },
                { title: "Assign Participant", url: "/admin/assign", icon: Briefcase },
                { title: "Settings", url: "/settings", icon: Settings },
                { title: "Account", url: "/account", icon: User },
            ],
        },
    ],
    university_supervisor: [
        {
            title: "Main Menu",
            items: [
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
                { title: "University", url: "/supervisor/university", icon: Building2 },
            ],
        },
        {
            title: "Monitor",
            items: [
                { title: "Monitor Logbook", url: "/supervisor/logbook", icon: Monitor },
                { title: "Monitor Output", url: "/supervisor/output", icon: LineChart },
            ],
        },
        {
            title: "System",
            items: [
                { title: "Account", url: "/account", icon: User },
            ],
        },
    ],
    super_admin: [
        {
            title: "Main Menu",
            items: [
                { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
                { title: "Workspace", url: "/super/workspace", icon: Briefcase },
                { title: "University", url: "/super/university", icon: Building2 },
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
                { title: "Settings", url: "/settings", icon: Settings },
                { title: "Account", url: "/account", icon: User },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { role } = useRole()

    const navData = menus[role] || menus.mentor

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                        <span className="font-bold">MA</span>
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">Mentor AI</span>
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
