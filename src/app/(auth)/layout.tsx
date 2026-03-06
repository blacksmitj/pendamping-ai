import * as React from "react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4 md:p-8">
            <div className="w-full max-w-[400px]">
                {children}
            </div>
        </div>
    )
}
