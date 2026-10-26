export interface AdminPagination {
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPageUrl: string | null
  pageNumber: number
  pageSize: number
  previousPageUrl: string | null
  totalItems: number
  totalPages: number
}

export interface AdminPaginatedResponse<TData> {
  data: TData[]
  pagination: AdminPagination
}

export interface AdminPaginationQuery {
  pageNumber?: number
  pageSize?: number
}

export interface AdminClientTableQuery extends AdminPaginationQuery {
  search?: string
}

export function paginateAdminItems<TItem>(items: TItem[], query: AdminClientTableQuery): AdminPaginatedResponse<TItem> {
  const pageNumber = query.pageNumber ?? 1
  const pageSize = query.pageSize ?? 10
  const start = (pageNumber - 1) * pageSize
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  return {
    data: items.slice(start, start + pageSize),
    pagination: {
      totalItems,
      totalPages,
      pageNumber,
      pageSize,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
      nextPageUrl: null,
      previousPageUrl: null
    }
  }
}
