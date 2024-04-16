import Elysia, { t } from 'elysia'
import { z } from 'zod'

const get = t.Partial(
  t.Object({
    id: t.String(),
    keyword: t.String(),
  }),
)

const createPost = t.Object({
  content: t.String(),
  image: t.String(),
})

const updatePost = t.Partial(
  t.Object({
    content: t.String(),
    image: t.String(),
  }),
)

const deletePost = t.Object({
  id: t.String(),
})

export const postModel = new Elysia({ name: 'Model.Post' }).model({
  get,
  createPost,
  updatePost,
  deletePost,
})

export const createSchema = z.object({
  content: z.string().min(4, { message: 'Content must be at least 4 characters long' }),
  image: z.optional(z.instanceof(File)),
})

export const updateSchema = z.object({
  content: z.optional(z.string().min(4, { message: 'Content must be at least 4 characters long' })),
  image: z.optional(z.instanceof(File)),
})
