import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'

export type Column<T> = {
  key: string
  header: string
  render: (item: T) => React.ReactNode
  className?: string
  searchable?: boolean
}

type PerformaTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  searchable?: boolean
  searchPlaceholder?: string
  getSearchValue?: (item: T) => string
  isLoading?: boolean
  skeletonRows?: number
}

export function PerformaTable<T>({
  data,
  columns,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Search...',
  getSearchValue,
  isLoading = false,
  skeletonRows = 5,
}: PerformaTableProps<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search.trim() || !getSearchValue) return data
    const q = search.toLowerCase()
    return data.filter((item) => getSearchValue(item).toLowerCase().includes(q))
  }, [data, search, getSearchValue])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize)

  // Reset to first page when search changes
  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-white/12 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25 transition-colors"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/8 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-white/50 text-xs font-medium uppercase tracking-wider ${col.className ?? ''}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-white/8 hover:bg-transparent"
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginated.map((item, i) => (
                  <TableRow
                    key={i}
                    className="border-white/8 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.render(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            {!isLoading && paginated.length === 0 && (
              <TableRow className="border-white/8 hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-sm text-white/30"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && filtered.length > pageSize && (
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>
            Showing {page * pageSize + 1}–
            {Math.min((page + 1) * pageSize, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-white/60">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
