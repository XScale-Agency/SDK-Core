import { DateTime } from 'luxon'
import { z } from 'zod'

export const PaginationMetaSchema = z.object({
  total: z.number().int(),
  perPage: z.number().int(),
  currentPage: z.number().int(),
  lastPage: z.number().int(),
  firstPage: z.number().int(),
  firstPageUrl: z.string(),
  lastPageUrl: z.string(),
  nextPageUrl: z.string().nullable(),
  previousPageUrl: z.string().nullable(),
})

export const PaginationQuerySchema = z.object({
  limit: z.number().int().optional(),
  page: z.number().int().optional(),
})

export const DateSchema = z.string().transform((value) => DateTime.fromISO(value))
