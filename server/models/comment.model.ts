import Elysia, { t } from 'elysia'
import { z } from 'zod'

const createComment = t.Object({
  content: t.String(),
})

const updateComment = t.Partial(
  t.Object({
    content: t.String(),
  }),
)

export const commentModel = new Elysia({ name: 'Model.Comment' }).model({
  createComment,
  updateComment,
})

export const commentSchema = z.object({
  content: z.string(),
})
