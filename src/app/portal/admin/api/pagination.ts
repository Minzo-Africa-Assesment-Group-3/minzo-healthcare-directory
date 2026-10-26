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
