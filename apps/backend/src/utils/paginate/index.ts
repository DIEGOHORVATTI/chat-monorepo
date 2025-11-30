export type PaginateOptions = {
  page?: number
  limit?: number
}

export type MetaPagination = {
  total: number
  page: number
  limit: number
  pages: number
}

export type PaginateResult<T> = {
  meta: MetaPagination
  data: T[]
}

export const paginate = <T>(
  data: T[],
  total: number,
  { page = 1, limit = 20 }: PaginateOptions = {}
): PaginateResult<T> => {
  const pages = Math.ceil(total / limit)

  return {
    data,
    meta: {
      total,
      page,
      limit,
      pages,
    },
  }
}
