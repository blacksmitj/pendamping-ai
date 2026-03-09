import * as React from "react"
import { Search } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData> {
    columns: { header: string; accessor?: keyof TData; className?: string; cell?: (item: TData) => React.ReactNode }[]
    data: TData[]
    searchPlaceholder?: string
    filters?: React.ReactNode
    totalItems?: number
    currentPage?: number
    itemsPerPage?: number
    onRowClick?: (item: TData) => void
    isLoading?: boolean
}

export function DataTable<TData>({
    columns,
    data,
    searchPlaceholder = "Cari...",
    filters,
    totalItems = data.length,
    currentPage = 1,
    itemsPerPage = 10,
    onRowClick,
    isLoading,
}: DataTableProps<TData>) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background px-1">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        className="pl-9 bg-card border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20 h-10"
                    />
                </div>
                {filters && <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">{filters}</div>}
            </div>

            <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/40 border-b border-slate-100">
                            <TableRow className="hover:bg-transparent border-none">
                                {columns.map((col, i) => (
                                    <TableHead key={i} className={`h-10 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap ${col.className || ""}`}>
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <span className="text-xs font-medium">Memuat data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.length > 0 ? (
                                data.map((item, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        className={`group transition-colors border-slate-50 ${onRowClick ? "cursor-pointer hover:bg-slate-50/80" : "hover:bg-slate-50/40"}`}
                                        onClick={() => onRowClick && onRowClick(item)}
                                    >
                                        {columns.map((col, colIndex) => (
                                            <TableCell key={colIndex} className={`py-2.5 px-4 ${col.className || ""}`}>
                                                {col.cell ? col.cell(item) : (
                                                    <span className="text-sm text-slate-600 font-medium tracking-tight">
                                                        {item[col.accessor as keyof TData] ? String(item[col.accessor as keyof TData]) : "-"}
                                                    </span>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <Search className="h-6 w-6 opacity-20 mb-2" />
                                            <p className="text-sm font-medium">Tidak ada data ditemukan</p>
                                            <p className="text-[10px]">Coba sesuaikan kata kunci atau filter Anda</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px]">
                <p className="text-slate-400 font-medium">
                    Menampilkan <span className="text-slate-900 font-bold">{data.length}</span> dari <span className="text-slate-900 font-bold">{totalItems}</span> entri
                </p>
                <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-md border-slate-200 text-[10px] font-bold uppercase tracking-tight" disabled={currentPage === 1}>
                        Sebelumnya
                    </Button>
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-900 text-white font-bold text-[10px] shadow-sm shadow-slate-900/20">
                        {currentPage}
                    </div>
                    <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-md border-slate-200 text-[10px] font-bold uppercase tracking-tight" disabled={currentPage * itemsPerPage >= totalItems}>
                        Selanjutnya
                    </Button>
                </div>
            </div>
        </div>
    )
}
