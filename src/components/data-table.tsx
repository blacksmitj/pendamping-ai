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
        <div className="flex flex-col gap-4 bg-background">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={searchPlaceholder} className="pl-8" />
                </div>
                {filters && <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">{filters}</div>}
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, i) => (
                                <TableHead key={i} className={col.className}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                                    onClick={() => onRowClick && onRowClick(item)}
                                >
                                    {columns.map((col, colIndex) => (
                                        <TableCell key={colIndex} className={col.className}>
                                            {col.cell ? col.cell(item) : String(item[col.accessor as keyof TData])}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                    Menampilkan {data.length} dari {totalItems} data
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={currentPage === 1}>
                        Sebelumnya
                    </Button>
                    <Button variant="outline" size="sm" disabled={currentPage * itemsPerPage >= totalItems}>
                        Selanjutnya
                    </Button>
                </div>
            </div>
        </div>
    )
}
