"use client"

import { useSession } from "@/lib/auth-client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function PendingGuard({ children }: { children: React.ReactNode }) {
    const { data: session, isPending: sessionPending } = useSession()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (sessionPending) return

        const isPending = (session?.user as any)?.status === "PENDING"
        const isAccountPage = pathname === "/account"

        if (isPending && !isAccountPage) {
            router.push("/account")
        }
    }, [session, sessionPending, pathname, router])

    if (sessionPending) {
        return null // Or a loading spinner
    }

    const isPending = (session?.user as any)?.status === "PENDING"
    const isAccountPage = pathname === "/account"

    if (isPending && !isAccountPage) {
        return null // Prevent flash of content before redirect
    }

    return <>{children}</>
}
