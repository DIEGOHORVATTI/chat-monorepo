import { z } from 'zod'
import type { Meta, PaginationQuery, SchemaValidator } from './types'

/**
 * Zod implementation of shared schemas
 * This uses generics to maintain the interface contract
 */

export const metaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
}) satisfies z.ZodType<Meta>

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
}) satisfies z.ZodType<PaginationQuery>

// Generic message response schema used across modules
export const messageResponseSchema = z.object({
  message: z.string(),
})

/**
 * Helper to create a schema validator from Zod schema
 * This abstraction makes it easier to swap Zod for another library
 */
export function createValidator<T>(schema: z.ZodType<T>): SchemaValidator<T> {
  return {
    parse: (data: unknown) => schema.parse(data),
    safeParse: (data: unknown) => {
      const result = schema.safeParse(data)
      if (result.success) {
        return { success: true, data: result.data }
      }
      return { success: false, error: result.error }
    },
  }
}

// Re-export for backwards compatibility
export const meta = metaSchema
