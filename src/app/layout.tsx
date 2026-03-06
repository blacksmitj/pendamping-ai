import { Inter } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RoleProvider } from "@/components/providers/role-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Mentor AI",
  description: "Mentoring Management System",
}

import { QueryProvider } from "@/components/providers/query-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <RoleProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </RoleProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
