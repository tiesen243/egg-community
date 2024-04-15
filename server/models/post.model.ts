import Elysia, { t } from 'elysia'

const get = t.Partial(
  t.Object({
    id: t.String({ minLength: 4, error: 'ID must be at least 4 characters' }),
  }),
)

const createPost = t.Object({
  content: t.String({ minLength: 4, error: 'Content must be at least 4 characters' }),
})

const deletePost = t.Object({
  id: t.String({ minLength: 4, error: 'ID must be at least 4 characters' }),
})

export const postModel = new Elysia({ name: 'Model.Post' }).model({
  get,
  createPost,
  deletePost,
})
