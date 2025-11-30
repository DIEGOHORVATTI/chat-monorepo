/**
 * Shared types and interfaces
 * These are pure TypeScript interfaces that define contracts
 * Independent of any validation library (Zod, Yup, etc.)
 */

/**
 * Pagination metadata
 */
export interface Meta {
  total: number
  page: number
  limit: number
  pages: number
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page: number
  limit: number
}

/**
 * Schema validator interface
 * This abstraction allows us to switch validation libraries
 */
export interface SchemaValidator<T> {
  parse(data: unknown): T
  safeParse(data: unknown): { success: boolean; data?: T; error?: unknown }
}
