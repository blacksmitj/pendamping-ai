"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useRole } from "@/components/providers/role-provider"

const lineData = [
    { name: "Minggu 1", total: 4 },
    { name: "Minggu 2", total: 7 },
    { name: "Minggu 3", total: 5 },
    { name: "Minggu 4", total: 10 },
]

const universityPerformanceData = [
    { name: "UI", total: 85 },
    { name: "UGM", total: 78 },
    { name: "ITB", total: 92 },
    { name: "IPB", total: 80 },
]

const pieData = [
    { name: "Kuliner", value: 400 },
    { name: "Fashion", value: 300 },
    { name: "Jasa", value: 300 },
    { name: "Kriya", value: 200 },
]

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#f43f5e"]

export function OverviewCharts() {
    const { role } = useRole()

    const isHighRole = role === "super_admin" || role === "pengawas"
    const displayData = isHighRole ? universityPerformanceData : lineData
    const chartTitle = isHighRole ? "Performa Universitas (%)" : "Grafik Logbook"

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>{chartTitle}</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Distribusi Sektor</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
