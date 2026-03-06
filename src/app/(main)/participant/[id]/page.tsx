"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Save,
    MapPin,
    Phone,
    User as UserIcon,
    Calendar,
    CheckCircle2,
    TrendingUp,
    Briefcase,
    CreditCard,
    FileText,
    History,
    Download,
    Eye,
    Building,
    MessageCircle,
    Ban,
    Clock,
    DollarSign,
    Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts"

const revenueData = [
    { month: "Awal", revenue: 5000000 },
    { month: "Bulan 1", revenue: 5500000 },
    { month: "Bulan 2", revenue: 7200000 },
    { month: "Bulan 3", revenue: 8500000 },
]

const workerData = [
    { month: "Awal", workers: 2 },
    { month: "Bulan 1", workers: 2 },
    { month: "Bulan 2", workers: 3 },
    { month: "Bulan 3", workers: 4 },
]

const mockParticipant = {
    idTkm: "TKM-2025-001",
    name: "Ahmad Rifai",
    nik: "3204123456789001",
    email: "ahmad.rifai@example.com",
    phone: "081234567890",
    mentor: "Dr. Budi Santoso",
    university: "Universitas Indonesia",
    sector: "Kuliner",
    businessName: "Catering Berkah Jaya",
    businessType: "Mikro",
    status: "Active",
    province: "Jawa Barat",
    city: "Bandung",
    address: "Jl. Merdeka No. 45, Coblong",
    disability: "Tidak",
    education: "S1",
    registeredAt: "2025-01-15",
    baseline: {
        revenue: 5000000,
        volume: 100,
        unit: "Porsi",
        workers: 2,
    }
}

const mockLogbooks = [
    { id: "L001", date: "2026-03-05", startTime: "09:00", endTime: "11:00", material: "Business Model Canvas", delivery: "FACE_TO_FACE", summary: "Mendiskusikan value proposition dan customer segment." },
    { id: "L002", date: "2026-02-20", startTime: "14:00", endTime: "16:00", material: "Manajemen Keuangan", delivery: "ONLINE", summary: "Penjelasan pencatatan arus kas sederhana." },
]

const mockCapaian = [
    { id: "C001", month: "Bulan 1", date: "2026-02-01", revenue: 5500000, volume: 110, workers: 2, status: "Approved" },
    { id: "C002", month: "Bulan 2", date: "2026-03-01", revenue: 7200000, volume: 150, workers: 3, status: "Approved" },
    { id: "C003", month: "Bulan 3", date: "2026-04-01", revenue: 8500000, volume: 180, workers: 4, status: "Pending" },
]

export default function PesertaDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-10">
            {/* Top Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-full hover:bg-slate-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900">{mockParticipant.name}</h1>
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-2 py-0 h-5 text-[10px] uppercase font-bold tracking-wider">
                                {mockParticipant.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            {mockParticipant.idTkm} • {mockParticipant.businessName} • {mockParticipant.sector}
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6 pr-4">
                    <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Mentor</p>
                        <p className="text-sm font-semibold text-slate-700">{mockParticipant.mentor}</p>
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                    <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">University</p>
                        <p className="text-sm font-semibold text-slate-700">{mockParticipant.university}</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="progress" className="w-full">
                <div className="flex items-center justify-between mb-2">
                    <TabsList className="bg-slate-100/50 p-1 border">
                        <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Monitoring</TabsTrigger>
                        <TabsTrigger value="profile">Full Profile</TabsTrigger>
                        <TabsTrigger value="logbook">Logbook History</TabsTrigger>
                        <TabsTrigger value="capaian">Output History</TabsTrigger>
                        <TabsTrigger value="files">Documents</TabsTrigger>
                        <TabsTrigger value="update">Status Update</TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab: Progress Dashboard */}
                <TabsContent value="progress" className="space-y-6 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stats Summary */}
                        <div className="md:col-span-1 space-y-4">
                            <Card className="border-indigo-100 bg-indigo-50/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" /> Revenue Growth
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-extrabold text-indigo-700">+70%</span>
                                        <span className="text-xs text-indigo-500 font-medium font-mono">Vs Baseline</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-2 font-medium">Target: Rp 10.000.000 / Month</p>
                                </CardContent>
                            </Card>
                            <Card className="border-emerald-100 bg-emerald-50/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                                        <Users className="h-4 w-4" /> Workers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-extrabold text-emerald-700">4</span>
                                        <span className="text-xs text-emerald-500 font-medium font-mono">People</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-2 font-medium">+2 New Workers (Month 3)</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold">Report Completeness</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Output Report</span>
                                        <Badge className="bg-indigo-100 text-indigo-700 border-none">3/3 Months</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Daily Logbook</span>
                                        <Badge className="bg-amber-100 text-amber-700 border-none">12 Visits</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Profile Update</span>
                                        <Badge className="bg-emerald-100 text-emerald-700 border-none">Complete</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Area */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-md flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-indigo-600" /> Monthly Revenue Trend
                                    </CardTitle>
                                    <CardDescription>Comparison of Revenue from Baseline to Present.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueData}>
                                                <defs>
                                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp ${val / 1000000}jt`} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(val) => `Rp ${new Intl.NumberFormat('id-ID').format(Number(val))}`}
                                                />
                                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Full Profile */}
                <TabsContent value="profile" className="outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <UserIcon className="h-5 w-5 text-indigo-600" /> Personal Identity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Full Name</p>
                                        <p className="text-sm font-medium">{mockParticipant.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">National ID</p>
                                        <p className="text-sm font-medium font-mono tracking-tighter">{mockParticipant.nik}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Email</p>
                                        <p className="text-sm font-medium">{mockParticipant.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">WhatsApp</p>
                                        <p className="text-sm font-medium">{mockParticipant.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Education</p>
                                        <p className="text-sm font-medium">{mockParticipant.education}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Disability</p>
                                        <p className="text-sm font-medium">{mockParticipant.disability}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building className="h-5 w-5 text-indigo-600" /> Business & Operational Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Business Name</p>
                                        <p className="text-sm font-medium">{mockParticipant.businessName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Sector</p>
                                        <p className="text-sm font-medium">{mockParticipant.sector}</p>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Business Address</p>
                                        <p className="text-sm font-medium">
                                            {mockParticipant.address}, {mockParticipant.city}, {mockParticipant.province}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Baseline Revenue</p>
                                        <p className="text-sm font-bold text-slate-700">Rp {new Intl.NumberFormat('id-ID').format(mockParticipant.baseline.revenue)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Baseline Volume</p>
                                        <p className="text-sm font-medium">{mockParticipant.baseline.volume} {mockParticipant.baseline.unit} / Month</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab: Logbook Histori */}
                <TabsContent value="logbook" className="outline-none">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Mentor Visit List</CardTitle>
                                <CardDescription>Daily activity records performed by {mockParticipant.mentor}.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="h-9">
                                <Download className="mr-2 h-4 w-4" /> Export Excel
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 border-y">
                                        <TableHead className="w-[120px]">Date</TableHead>
                                        <TableHead>Mentoring Topic</TableHead>
                                        <TableHead className="w-[100px]">Method</TableHead>
                                        <TableHead className="w-[100px]">Time</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockLogbooks.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium text-slate-900">{log.date}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-800">{log.material}</span>
                                                    <span className="text-xs text-slate-500 line-clamp-1 italic">{log.summary}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={log.delivery === 'FACE_TO_FACE' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'}>
                                                    {log.delivery === 'FACE_TO_FACE' ? 'Face-to-Face' : 'Online'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500 font-mono text-xs">{log.startTime} - {log.endTime}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Capaian Output */}
                <TabsContent value="capaian" className="outline-none">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Monthly Output Report</CardTitle>
                            <CardDescription>Visualization of participant KPIs progress per reporting period.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Month</TableHead>
                                        <TableHead className="text-right">Revenue (Rp)</TableHead>
                                        <TableHead className="text-right">Sales Volume</TableHead>
                                        <TableHead className="text-right">Workers</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="bg-slate-50/30">
                                        <TableCell className="italic font-medium text-slate-400">Baseline (Initial Data)</TableCell>
                                        <TableCell className="text-right text-slate-500">{new Intl.NumberFormat('id-ID').format(mockParticipant.baseline.revenue)}</TableCell>
                                        <TableCell className="text-right text-slate-500">{mockParticipant.baseline.volume}</TableCell>
                                        <TableCell className="text-right text-slate-500">{mockParticipant.baseline.workers}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-slate-400">Fixed</Badge></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                    {mockCapaian.map((cap) => (
                                        <TableRow key={cap.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-bold text-slate-900">{cap.month}</TableCell>
                                            <TableCell className="text-right font-medium text-indigo-600">{new Intl.NumberFormat('id-ID').format(cap.revenue)}</TableCell>
                                            <TableCell className="text-right">{cap.volume}</TableCell>
                                            <TableCell className="text-right font-bold">{cap.workers}</TableCell>
                                            <TableCell>
                                                <Badge variant={cap.status === 'Approved' ? 'default' : 'secondary'} className={cap.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500 text-white border-none'}>
                                                    {cap.status === 'Approved' ? 'Finished' : 'Review'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600">
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Files Repository */}
                <TabsContent value="files" className="outline-none">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Participant Document Archive</CardTitle>
                            <CardDescription>All files uploaded by mentors and participants.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { title: "Foto KTP", type: "Identification", date: "2025-01-15", icon: CreditCard },
                                    { title: "File BMC", type: "Strategi Usaha", date: "2026-03-01", icon: FileText },
                                    { title: "Rencana Aksi", type: "Proposal", date: "2026-03-01", icon: Briefcase },
                                    { title: "Laporan Bulan 1", type: "LPJ", date: "2026-02-10", icon: FileText },
                                    { title: "Laporan Bulan 2", type: "LPJ", date: "2026-03-12", icon: FileText },
                                    { title: "Bukti Omset B1", type: "Keuangan", date: "2026-02-10", icon: FileText },
                                ].map((file, i) => (
                                    <div key={i} className="group p-4 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer">
                                        <div className="flex flex-col gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-slate-50 border flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <file.icon className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-700">{file.title}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold">{file.type}</span>
                                                    <span className="text-[10px] text-slate-400">{file.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="sm" variant="outline" className="h-7 text-[10px] flex-1">Download</Button>
                                                <Button size="sm" variant="outline" className="h-7 text-[10px] p-0 w-7"><Eye className="h-3 w-3" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Update Form */}
                <TabsContent value="update" className="outline-none">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="h-5 w-5 text-indigo-600" /> Update Mentoring Status
                            </CardTitle>
                            <CardDescription>Updated by mentors periodically.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-sm font-bold flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-slate-400" /> Communication Status
                                    </Label>
                                    <RadioGroup defaultValue="smooth" className="space-y-2">
                                        <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-slate-50 transition-colors">
                                            <RadioGroupItem value="smooth" id="l1" />
                                            <Label htmlFor="l1" className="flex-1 cursor-pointer">Smooth & Responsive</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-slate-50 transition-colors">
                                            <RadioGroupItem value="passive" id="l2" />
                                            <Label htmlFor="l2" className="flex-1 cursor-pointer">Passive / Slow Response</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-slate-50 transition-colors">
                                            <RadioGroupItem value="hard" id="l3" />
                                            <Label htmlFor="l3" className="flex-1 cursor-pointer">Hard to Contact</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-slate-400" /> Disbursement Status
                                    </Label>
                                    <Select defaultValue="stage1">
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select Stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="stage1">Disbursed Stage 1 (Month 1)</SelectItem>
                                            <SelectItem value="stage2">Disbursed Stage 2 (Month 3)</SelectItem>
                                            <SelectItem value="delayed">Delayed / Issue</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold flex items-center gap-2">
                                        <Ban className="h-4 w-4 text-slate-400" /> Special Conditions
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="drop" className="flex-1 text-slate-600">This participant dropped / withdrew</Label>
                                        <Input type="checkbox" id="drop" className="h-5 w-5 rounded-md border-slate-300" />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label className="text-xs">Reason for Dropping (If Any)</Label>
                                        <Input placeholder="Write reason if participant drops..." />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 rounded-b-xl py-4 justify-between">
                            <p className="text-xs text-slate-500 italic flex items-center gap-1.5">
                                <Clock className="h-3 w-3" /> Last updated by Mentor on 2026-03-05 10:30
                            </p>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 shadow-lg">
                                <Save className="mr-2 h-4 w-4" /> Save Status Update
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
