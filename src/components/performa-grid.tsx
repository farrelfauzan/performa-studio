import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

type PerformaGridProps<T> = {
  data: T[]
  renderItem: (item: T) => React.ReactNode
  renderSkeleton?: (index: number) => React.ReactNode
  pageSize?: number
  page?: number
  onPageChange?: (page: number) => void
  search?: string
  onSearchChange?: (search: string) => void
  searchable?: boolean
  searchPlaceholder?: string
  getSearchValue?: (item: T) => string
  onItemClick?: (item: T) => void
  isLoading?: boolean
  skeletonCount?: number
  columns?: {
    sm?: number
    md?: number
    lg?: number
  }
  emptyMessage?: string
}

export function PerformaGrid<T>({
  data,
  renderItem,
  renderSkeleton,
  pageSize = 9,
  page: controlledPage,
  onPageChange,
  search: controlledSearch,
  onSearchChange,
  searchable = true,
  searchPlaceholder = 'Search...',
  getSearchValue,
  onItemClick,
  isLoading = false,
  skeletonCount = 6,
  columns = { sm: 2, lg: 3 },
  emptyMessage = 'No results found',
}: PerformaGridProps<T>) {
  const [internalSearch, setInternalSearch] = useState('')
  const [internalPage, setInternalPage] = useState(0)

  const search = controlledSearch ?? internalSearch
  const setSearch = (v: string) => {
    onSearchChange ? onSearchChange(v) : setInternalSearch(v)
  }

  const page = controlledPage ?? internalPage
  const setPage = (v: number | ((prev: number) => number)) => {
    const next = typeof v === 'function' ? v(page) : v
    onPageChange ? onPageChange(next) : setInternalPage(next)
  }

  const filtered = useMemo(() => {
    if (!search.trim() || !getSearchValue) return data
    const q = search.toLowerCase()
    return data.filter((item) => getSearchValue(item).toLowerCase().includes(q))
  }, [data, search, getSearchValue])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const effectivePage = Math.min(page, totalPages - 1)
  const paginated = filtered.slice(
    effectivePage * pageSize,
    (effectivePage + 1) * pageSize,
  )

  const handleSearch = (value: string) => {
    setSearch(value)
    if (!onPageChange) setPage(0)
  }

  const gridCols = [
    'grid-cols-1',
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
  ]
    .filter(Boolean)
    .join(' ')

  const defaultSkeleton = (i: number) => (
    <div
      key={i}
      className="animate-pulse rounded-2xl border border-white/12 bg-white/5 p-5"
    >
      <div className="h-28 rounded-xl bg-white/10 mb-4" />
      <div className="h-4 w-36 rounded bg-white/10 mb-2" />
      <div className="h-3 w-20 rounded bg-white/5" />
    </div>
  )

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

      {/* Grid */}
      <div className={`grid gap-4 ${gridCols}`}>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) =>
              (renderSkeleton ?? defaultSkeleton)(i),
            )
          : paginated.map((item, i) => (
              <div
                key={i}
                onClick={() => onItemClick?.(item)}
                className={onItemClick ? 'cursor-pointer' : ''}
              >
                {renderItem(item)}
              </div>
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && paginated.length === 0 && (
        <div className="flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 py-12">
          <p className="text-sm text-white/30">{emptyMessage}</p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filtered.length > pageSize && (
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>
            Showing {effectivePage * pageSize + 1}–
            {Math.min((effectivePage + 1) * pageSize, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={effectivePage === 0}
              className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-white/60">
              {effectivePage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={effectivePage >= totalPages - 1}
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
