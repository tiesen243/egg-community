import Elysia, { t } from 'elysia'

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
