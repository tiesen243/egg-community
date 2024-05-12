import { z } from 'zod'

export const postSchema = z.object({
  content: z.string().min(4, { message: 'Content must be at least 4 characters long' }),
  image: z.optional(z.instanceof(File)),
})
export type PostSchema = z.infer<typeof postSchema>
