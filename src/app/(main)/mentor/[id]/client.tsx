"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Users,
    BookOpen,
    Award,
    GraduationCap,
    MapPin,
    Mail,
    Phone,
    Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

interface MentorDetailClientProps {
    mentor: any
}

export default function MentorDetailClient({ mentor }: MentorDetailClientProps) {
    const router = useRouter()

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            {/* Header / Navigation */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-full hover:bg-slate-100">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mentor Profile</h1>
                    <p className="text-sm text-slate-500 font-medium">Detailed information and performance of {mentor.name}</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Profile Card */}
                <Card className="lg:col-span-4 border-slate-200/60 shadow-sm h-fit">
                    <CardContent className="pt-8 flex flex-col items-center text-center">
                        <Avatar className="h-28 w-28 mb-4 border-4 border-indigo-50 p-1 bg-white">
                            <AvatarImage src={mentor.image} />
                            <AvatarFallback className="text-2xl bg-indigo-50 text-indigo-700">
                                {mentor.name?.slice(0, 2).toUpperCase() || "M"}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold text-slate-900">{mentor.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">
                                {mentor.role === 'MENTOR' ? 'Mentor' : mentor.role}
                            </Badge>
                            <Badge className={
                                mentor.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200" :
                                    mentor.status === "PENDING" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200" : ""
                            }>
                                {mentor.status}
                            </Badge>
                        </div>

                        <div className="w-full mt-8 space-y-4 text-sm text-left border-t border-slate-100 pt-8">
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-1">University</span>
                                    <span className="font-medium line-clamp-1">{mentor.university?.name || "-"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <Mail className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-1">Email</span>
                                    <span className="font-medium line-clamp-1">{mentor.email}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <Phone className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-1">WhatsApp</span>
                                    <span className="font-medium">{mentor.phone || "-"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <MapPin className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-1">Registration Date</span>
                                    <span className="font-medium">
                                        {new Date(mentor.createdAt).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats & Mentored Participants */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Stat Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="border-none bg-indigo-600 text-white shadow-indigo-100 shadow-lg">
                            <CardContent className="pt-6">
                                <p className="text-[10px] uppercase text-indigo-100 font-bold tracking-widest mb-1">Participants</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-bold">{mentor._count?.assignments || 0}</h3>
                                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <Users className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-indigo-200 mt-2">Active Mentoring</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none bg-emerald-600 text-white shadow-emerald-100 shadow-lg">
                            <CardContent className="pt-6">
                                <p className="text-[10px] uppercase text-emerald-100 font-bold tracking-widest mb-1">Logs</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-bold">{mentor._count?.logbooks || 0}</h3>
                                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-emerald-200 mt-2">Total Visits</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none bg-amber-500 text-white shadow-amber-100 shadow-lg">
                            <CardContent className="pt-6">
                                <p className="text-[10px] uppercase text-amber-50 | font-bold tracking-widest mb-1">Study Hours</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-bold">{mentor.totalStudyHours || 0}</h3>
                                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <Award className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-amber-100 mt-2">JPL Accumulated</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Participant List */}
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 bg-slate-50/50">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-indigo-600" />
                                    Mentored Participants
                                </CardTitle>
                                <CardDescription>List of participants currently being mentored by {mentor.name}.</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-white">{mentor._count?.assignments || 0} Total</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 border-y-0">
                                        <TableHead className="pl-6 font-bold text-slate-700">Name</TableHead>
                                        <TableHead className="font-bold text-slate-700">Sector</TableHead>
                                        <TableHead className="font-bold text-slate-700">Progress</TableHead>
                                        <TableHead className="font-bold text-slate-700">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mentor.assignments?.length > 0 ? (
                                        mentor.assignments.map((a: any) => (
                                            <TableRow key={a.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <TableCell className="pl-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{a.participant?.fullName}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{a.participant?.tkmId}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-slate-600">{a.participant?.businessSector || "-"}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1.5 min-w-[100px]">
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                                            <span>Logbooks</span>
                                                            <span className="text-indigo-600">75%</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">
                                                        {a.participant?.status || "Active"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                                                No participants assigned yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        {mentor.assignments?.length > 0 && (
                            <div className="p-4 bg-slate-50/30 border-t border-slate-100 text-center">
                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => router.push('/admin/assign')}>
                                    Manage Assignments
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}
