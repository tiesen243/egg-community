import { z } from 'zod'

export const createSchema = z.object({
  content: z.string(),
  image: z.optional(z.instanceof(File)),
})

export const updateSchema = z.object({
  content: z.optional(z.string().min(4, { message: 'Content must be at least 4 characters long' })),
  image: z.optional(z.instanceof(File)),
})
