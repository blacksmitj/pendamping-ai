import { StatCards } from "@/components/dashboard/stat-cards"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { RecentLogbooks } from "@/components/dashboard/recent-logbooks"

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Ringkasan statistik dan aktivitas pendampingan terbaru.
                </p>
            </div>

            <StatCards />

            <OverviewCharts />

            <RecentLogbooks />
        </div>
    )
}
