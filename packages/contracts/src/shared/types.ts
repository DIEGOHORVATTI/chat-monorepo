export interface Meta {
  total: number
  page: number
  limit: number
  pages: number
}

export interface PaginationQuery {
  page: number
  limit: number
}

export interface SchemaValidator<T> {
  parse(data: unknown): T
  safeParse(data: unknown): { success: boolean; data?: T; error?: unknown }
}
