"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "@tanstack/react-query"
import { Icon } from "@iconify/react"
import { ChevronLeft, ChevronRight, ListFilter, RotateCcw, X } from "lucide-react"

import { DataTable } from "@/components/data-table"
import type { AdminPaginatedResponse } from "../../api/pagination"
import { AdminButton } from "../ui"

export type { AdminPaginatedResponse, AdminPagination } from "../../api/pagination"

export type AdminDataTableFilterType = "DateFilter" | "SelectFilter" | "MultiSelectFilter" | "TextFilter" | "DateRangeFilter" | "MonthYearFilter" | "AsyncSelectFilter"

export interface AdminDataTableFilterOption {
  label: string
  value: string
}

export interface AdminDataTableFilter {
  accessor: string | string[]
  asyncOptions?: (search: string) => Promise<AdminDataTableFilterOption[]>
  label: string
  options?: AdminDataTableFilterOption[]
  placeholder?: string
  type: AdminDataTableFilterType
}

interface AdminDataTableProps<TData, TValue> {
  actionLabel?: string
  columns: ColumnDef<TData, TValue>[]
  emptyMessage?: string
  fetchData?: (query: AdminDataTableQuery) => Promise<AdminPaginatedResponse<TData>>
  filters?: AdminDataTableFilters
  hasAction?: boolean
  heading?: ReactNode
  isLoading?: boolean
  onAction?: () => void
  onPageChange?: (pageNumber: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onRowClick?: (row: TData) => void
  pageSizeOptions?: number[]
  queryKey?: readonly unknown[]
  response?: AdminPaginatedResponse<TData>
  searchParam?: string
  searchPlaceholder?: string
  secondaryActionLabel?: string
  secondaryAction?: boolean
  onSecondaryAction?: () => void
  showSearch?: boolean
  extendedFilter?: {
    enable: boolean
    filters: AdminDataTableFilter[]
  }
  isFilterVisibleOnStart?: boolean
  persistFiltersInUrl?: boolean
}

export interface AdminDataTableQuery {
  pageNumber: number
  pageSize: number
  search?: string
  [key: string]: string | number | boolean | undefined
}

export type AdminDataTableFilters = Record<string, string | number | boolean | undefined>

function getFilterKeys(filter: AdminDataTableFilter): string[] {
  return Array.isArray(filter.accessor) ? filter.accessor : [filter.accessor]
}

function readFiltersFromUrl(searchParams: URLSearchParams, filters: AdminDataTableFilter[]): AdminDataTableFilters {
  return filters.reduce<AdminDataTableFilters>((result, filter) => {
    getFilterKeys(filter).forEach((key) => {
      const value = searchParams.get(key)
      if (!value) return

      result[key] = filter.type === "MultiSelectFilter" ? value : value
    })

    return result
  }, {})
}

function AdminDataTableLoadingSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <div aria-label="Loading table data" aria-live="polite" className="overflow-hidden rounded-xl border bg-white">
      <div className="border-b bg-[#f8f9fa] px-5 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div className="grid min-h-[68px] grid-cols-1 items-center gap-4 px-5 py-4 sm:grid-cols-3" key={rowIndex}>
            {Array.from({ length: Math.min(columnCount, 3) }).map((__, columnIndex) => (
              <div className={`h-4 animate-pulse rounded bg-slate-200 ${columnIndex === 0 ? "w-4/5" : columnIndex === 1 ? "w-3/5" : "w-2/5"}`} key={columnIndex} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminDataTable<TData, TValue>({
  actionLabel = "Add record",
  columns,
  emptyMessage = "No results found.",
  fetchData,
  filters = {},
  hasAction = false,
  heading,
  isLoading = false,
  onAction,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  pageSizeOptions = [10, 20, 50],
  queryKey = ["admin-data-table"],
  response,
  searchParam = "search",
  searchPlaceholder = "Search…",
  showSearch = true,
  secondaryAction = false,
  secondaryActionLabel = "Secondary action",
  onSecondaryAction,
  extendedFilter,
  isFilterVisibleOnStart = false,
  persistFiltersInUrl = false
}: AdminDataTableProps<TData, TValue>) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterDefinitions = extendedFilter?.filters ?? []
  const [search, setSearch] = useState(() => persistFiltersInUrl ? searchParams.get(searchParam) ?? "" : "")
  const [debouncedSearch, setDebouncedSearch] = useState(() => persistFiltersInUrl ? searchParams.get(searchParam) ?? "" : "")
  const [internalPageNumber, setInternalPageNumber] = useState(1)
  const [internalPageSize, setInternalPageSize] = useState(pageSizeOptions[0])
  const [extendedFilters, setExtendedFilters] = useState<AdminDataTableFilters>(() => persistFiltersInUrl ? readFiltersFromUrl(searchParams, filterDefinitions) : {})
  const [isFilterVisible, setIsFilterVisible] = useState(isFilterVisibleOnStart)
  const [asyncOptions, setAsyncOptions] = useState<Record<string, AdminDataTableFilterOption[]>>({})
  const usesInternalDataFetching = Boolean(fetchData)
  const filtersKey = JSON.stringify(filters)
  const activeFiltersCount = Object.values(extendedFilters).filter((value) => value !== undefined && value !== null && value !== "").length

  function updateUrl(updates: Record<string, string | number | undefined>) {
    if (!persistFiltersInUrl) return

    const nextSearchParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") nextSearchParams.delete(key)
      else nextSearchParams.set(key, String(value))
    })

    const query = nextSearchParams.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setInternalPageNumber(1)
      updateUrl({ [searchParam]: search.trim(), pageNumber: 1 })
    }, 300)
    return () => globalThis.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const timer = globalThis.setTimeout(() => setInternalPageNumber(1), 0)

    return () => globalThis.clearTimeout(timer)
  }, [filtersKey])

  const internalQuery = useMemo<AdminDataTableQuery>(() => ({ ...filters, ...extendedFilters, pageNumber: internalPageNumber, pageSize: internalPageSize, ...(debouncedSearch ? { [searchParam]: debouncedSearch } : {}) }), [debouncedSearch, extendedFilters, filters, internalPageNumber, internalPageSize, searchParam])
  const internalQueryResult = useQuery({ queryKey: [...queryKey, internalQuery], queryFn: () => fetchData!(internalQuery), enabled: usesInternalDataFetching })
  const resolvedResponse = fetchData ? internalQueryResult.data : response
  const resolvedIsLoading = isLoading || internalQueryResult.isLoading
  const isRefreshing = usesInternalDataFetching && internalQueryResult.isFetching && Boolean(resolvedResponse)
  const pagination = resolvedResponse?.pagination
  const pageNumber = pagination?.pageNumber ?? 1
  const pageSize = pagination?.pageSize ?? pageSizeOptions[0]
  const totalItems = pagination?.totalItems ?? 0
  const totalPages = pagination?.totalPages ?? 1
  const firstItem = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1
  const lastItem = Math.min(pageNumber * pageSize, totalItems)

  function changePage(nextPage: number) {
    if (usesInternalDataFetching) {
      setInternalPageNumber(nextPage)
      updateUrl({ pageNumber: nextPage })
    }
    else onPageChange?.(nextPage)
  }

  function changePageSize(nextPageSize: number) {
    if (usesInternalDataFetching) {
      setInternalPageSize(nextPageSize)
      setInternalPageNumber(1)
      updateUrl({ pageNumber: 1, pageSize: nextPageSize })
    } else onPageSizeChange?.(nextPageSize)
  }

  function changeExtendedFilter(filter: AdminDataTableFilter, value: string | undefined) {
    const keys = getFilterKeys(filter)
    const values = filter.type === "DateRangeFilter" ? (value?.split(",") ?? []) : [value]
    const nextFilters = { ...extendedFilters }
    const urlUpdates: Record<string, string | undefined> = { pageNumber: "1" }

    keys.forEach((key, index) => {
      const nextValue = values[index]
      if (nextValue) nextFilters[key] = nextValue
      else delete nextFilters[key]
      urlUpdates[key] = nextValue
    })

    setExtendedFilters(nextFilters)
    setInternalPageNumber(1)
    updateUrl(urlUpdates)
  }

  function clearExtendedFilters() {
    const urlUpdates = Object.fromEntries(filterDefinitions.flatMap((filter) => getFilterKeys(filter).map((key) => [key, undefined])))
    setExtendedFilters({})
    setInternalPageNumber(1)
    updateUrl({ ...urlUpdates, pageNumber: "1" })
  }

  async function loadAsyncOptions(filter: AdminDataTableFilter, value: string) {
    if (!filter.asyncOptions) return

    setAsyncOptions((current) => ({ ...current, [getFilterKeys(filter)[0]]: [] }))
    const options = await filter.asyncOptions(value)
    setAsyncOptions((current) => ({ ...current, [getFilterKeys(filter)[0]]: options }))
  }

  function renderExtendedFilter(filter: AdminDataTableFilter) {
    const keys = getFilterKeys(filter)
    const value = String(extendedFilters[keys[0]] ?? "")
    const inputClassName = "h-10 w-full rounded-xl border border-[#ced4da] bg-white px-3 text-sm text-[#212121] outline-none focus:border-[#0C486D] focus:ring-2 focus:ring-[#0C486D]/20"

    if (filter.type === "SelectFilter" || filter.type === "MultiSelectFilter") {
      return <label className="space-y-1.5"><span className="text-xs font-medium text-[#495057]">{filter.label}</span><select className={inputClassName} multiple={filter.type === "MultiSelectFilter"} onChange={(event) => changeExtendedFilter(filter, filter.type === "MultiSelectFilter" ? Array.from(event.currentTarget.selectedOptions, (option) => option.value).join(",") : event.target.value)} value={filter.type === "MultiSelectFilter" ? value.split(",").filter(Boolean) : value}><option value="">All</option>{filter.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
    }

    if (filter.type === "DateRangeFilter") {
      const [from = "", to = ""] = value.split(",")
      return <fieldset className="space-y-1.5"><legend className="text-xs font-medium text-[#495057]">{filter.label}</legend><div className="grid grid-cols-2 gap-2"><input aria-label={`${filter.label} from`} className={inputClassName} onChange={(event) => changeExtendedFilter(filter, `${event.target.value},${to}`)} type="date" value={from} /><input aria-label={`${filter.label} to`} className={inputClassName} onChange={(event) => changeExtendedFilter(filter, `${from},${event.target.value}`)} type="date" value={to} /></div></fieldset>
    }

    if (filter.type === "AsyncSelectFilter") {
      return <label className="space-y-1.5"><span className="text-xs font-medium text-[#495057]">{filter.label}</span><input className={inputClassName} list={`${keys[0]}-options`} onChange={(event) => { changeExtendedFilter(filter, event.target.value); void loadAsyncOptions(filter, event.target.value) }} placeholder={filter.placeholder ?? `Search ${filter.label}…`} value={value} /><datalist id={`${keys[0]}-options`}>{asyncOptions[keys[0]]?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</datalist></label>
    }

    return <label className="space-y-1.5"><span className="text-xs font-medium text-[#495057]">{filter.label}</span><input className={inputClassName} onChange={(event) => changeExtendedFilter(filter, event.target.value)} placeholder={filter.placeholder ?? `Filter ${filter.label}`} type={filter.type === "DateFilter" ? "date" : filter.type === "MonthYearFilter" ? "month" : "text"} value={value} /></label>
  }

  return (
    <div className="space-y-4">
      {heading || hasAction || secondaryAction ? <div className="flex flex-col gap-3 rounded-xl border border-[#e0e0e0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div>{typeof heading === "string" ? <h2 className="text-lg font-semibold text-[#212121]">{heading}</h2> : heading}</div><div className="flex flex-wrap gap-2">{secondaryAction ? <AdminButton onClick={onSecondaryAction} size="compact" type="button" variant="outline">{secondaryActionLabel}</AdminButton> : null}{hasAction ? <AdminButton onClick={onAction} size="compact" type="button">{actionLabel}</AdminButton> : null}</div></div> : null}
      {fetchData && (showSearch || extendedFilter?.enable) ? <div className="flex flex-col gap-3 rounded-xl border border-[#e0e0e0] bg-white p-3 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 gap-2">{showSearch ? <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#ced4da] bg-white px-4 text-[#757575]"><Icon icon="solar:magnifer-linear" width={18} /><input aria-label={searchPlaceholder} className="w-full bg-transparent text-sm text-[#212121] outline-none placeholder:text-[#757575]" onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} type="search" value={search} />{search ? <button aria-label="Clear search" onClick={() => setSearch("")} type="button"><X size={16} /></button> : null}</label> : null}{extendedFilter?.enable ? <AdminButton aria-expanded={isFilterVisible} aria-label="Toggle filters" onClick={() => setIsFilterVisible((visible) => !visible)} size="compact" type="button" variant={isFilterVisible ? "primary" : "outline"}><ListFilter size={16} />Filters{activeFiltersCount ? <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">{activeFiltersCount}</span> : null}</AdminButton> : null}<AdminButton aria-label="Refresh table" onClick={() => void internalQueryResult.refetch()} size="compact" type="button" variant="outline"><RotateCcw className={internalQueryResult.isFetching ? "animate-spin" : ""} size={16} /></AdminButton></div></div> : null}
      {extendedFilter?.enable && isFilterVisible ? <section className="space-y-4 rounded-xl border border-[#e0e0e0] bg-white p-4"><div className="flex items-center justify-between border-b border-[#e9ecef] pb-3"><h3 className="text-sm font-semibold text-[#212121]">Filter parameters</h3>{activeFiltersCount ? <button className="text-sm font-medium text-red-600 hover:underline" onClick={clearExtendedFilters} type="button">Reset filters</button> : null}</div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{filterDefinitions.map((filter) => <div key={getFilterKeys(filter).join("-")}>{renderExtendedFilter(filter)}</div>)}</div></section> : null}
      {resolvedIsLoading && !resolvedResponse ? <AdminDataTableLoadingSkeleton columnCount={columns.length} /> : <div className="relative overflow-hidden rounded-xl border bg-white">
      {isRefreshing ? <div aria-live="polite" className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-[#0C486D]/10"><div className="h-full w-1/3 animate-pulse bg-[#0C486D]" /></div> : null}
      <DataTable
        className="rounded-none border-0"
        columns={columns}
        data={resolvedResponse?.data ?? []}
        emptyMessage={emptyMessage}
        isLoading={false}
        onRowClick={onRowClick}
        rowClassName={(_, index) => index % 2 === 0 ? "bg-white hover:bg-[#f6f9fb]" : "bg-[#f8fafb] hover:bg-[#f1f6f8]"}
        tableCellClassName="px-5 py-4 text-sm text-[#343a40]"
        tableHeadClassName="h-14 bg-[#eef3f6] px-5 text-xs font-semibold uppercase tracking-wide text-[#495057]"
      />

      <div className="flex flex-col gap-4 border-t px-4 py-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {firstItem}–{lastItem} of {totalItems} result{totalItems === 1 ? "" : "s"}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {onPageSizeChange ? (
            <label className="flex items-center gap-2">
              <span>Rows</span>
              <select
                aria-label="Rows per page"
                className="h-10 rounded-xl border border-input bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0C486D] focus:ring-2 focus:ring-[#0C486D]/20"
                disabled={resolvedIsLoading}
                onChange={(event) => changePageSize(Number(event.target.value))}
                value={pageSize}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <span aria-live="polite">
            Page {pageNumber} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <AdminButton
              aria-label="Previous page"
              disabled={resolvedIsLoading || !pagination?.hasPreviousPage}
              onClick={() => changePage(pageNumber - 1)}
              size="compact"
              type="button"
              variant="outline"
            >
              <ChevronLeft aria-hidden="true" />
              Previous
            </AdminButton>
            <AdminButton
              aria-label="Next page"
              disabled={resolvedIsLoading || !pagination?.hasNextPage}
              onClick={() => changePage(pageNumber + 1)}
              size="compact"
              type="button"
              variant="outline"
            >
              Next
              <ChevronRight aria-hidden="true" />
            </AdminButton>
          </div>
        </div>
      </div>
      </div>
      }
    </div>
  )
}
