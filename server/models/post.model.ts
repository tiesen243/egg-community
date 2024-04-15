import Elysia, { t } from 'elysia'

const get = t.Partial(
  t.Object({
    id: t.String(),
  }),
)

const createPost = t.Object({
  content: t.String(),
})

const deletePost = t.Object({
  id: t.String(),
})

export const postModel = new Elysia({ name: 'Model.Post' }).model({
  get,
  createPost,
  deletePost,
})
