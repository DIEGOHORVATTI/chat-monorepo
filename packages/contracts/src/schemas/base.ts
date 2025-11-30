import z from 'zod'

export const meta = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
})

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})
