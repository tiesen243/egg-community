import { z } from 'zod'

export const commentSchema = z.object({
  content: z.string(),
})
export type CommentSchema = z.infer<typeof commentSchema>
