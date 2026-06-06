import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Download, RefreshCw, Search } from 'lucide-react'
import { Button } from '../../lib/shadcn/button'
import { Input } from '../../lib/shadcn/input'
import { Skeleton } from '../../lib/shadcn/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../lib/shadcn/table'

export type DataTableProps<TData> = {
  title: string
  columns: ColumnDef<TData, any>[]
  data: TData[] | null | undefined
  loading?: boolean
  error?: string | null
  /** Re-trigger the underlying backend hook. */
  onRefresh?: () => void
  /** Filename used for CSV export (without extension). */
  exportFileName?: string
  /** Optional row click handler — e.g. for "Continue Working" rows. */
  onRowClick?: (row: TData) => void
  /** Empty-state copy. */
  emptyMessage?: string
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  let str: string
  if (value instanceof Date) {
    str = value.toISOString()
  } else if (typeof value === 'object') {
    str = JSON.stringify(value)
  } else {
    str = String(value)
  }
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function rowsToCsv<TData>(
  rows: TData[],
  columns: ColumnDef<TData, any>[],
): string {
  const headers = columns.map((c) => {
    const header = typeof c.header === 'string' ? c.header : (c.id ?? '')
    return csvEscape(header)
  })
  const lines: string[] = [headers.join(',')]
  for (const row of rows) {
    const cells = columns.map((c) => {
      const key = (c as { accessorKey?: string }).accessorKey ?? c.id
      const value = key ? (row as Record<string, unknown>)[key] : undefined
      return csvEscape(value)
    })
    lines.push(cells.join(','))
  }
  return lines.join('\n')
}

function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generic table renderer used by every dashboard table.
 *
 * Wraps TanStack Table in shadcn Table components with a toolbar that
 * provides a global text filter, a CSV download, and a refresh button.
 */
export default function DataTable<TData>({
  title,
  columns,
  data,
  loading,
  error,
  onRefresh,
  exportFileName,
  onRowClick,
  emptyMessage,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data])

  const table = useReactTable<TData>({
    data: rows,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
  })

  const handleDownload = () => {
    const filename = exportFileName ?? title.toLowerCase().replace(/\s+/g, '-')
    const visibleRows = table.getFilteredRowModel().rows.map((r) => r.original)
    downloadCsv(filename, rowsToCsv(visibleRows, columns))
  }

  const headerGroups = table.getHeaderGroups()
  const bodyRows = table.getRowModel().rows

  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <div className="flex flex-col gap-2 px-4 py-3 border-b sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Filter…"
              className="h-8 pl-7 w-40 sm:w-56"
              aria-label={`Filter ${title}`}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={loading || rows.length === 0}
            aria-label={`Download ${title} as CSV`}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading || !onRefresh}
            aria-label={`Refresh ${title}`}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {headerGroups.map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && rows.length === 0 ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  {columns.map((_col, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton className="h-4 w-full max-w-[160px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : bodyRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                  {emptyMessage ?? 'No records to display.'}
                </TableCell>
              </TableRow>
            ) : (
              bodyRows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
