import z from 'zod'

export const paginationSchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  search: z.string().optional(),
})
