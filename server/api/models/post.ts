import Elysia, { t } from 'elysia'

const get = t.Partial(
  t.Object({
    id: t.String(),
    keyword: t.String(),
  }),
)

const getAll = t.Array(
  t.Object({
    id: t.String(),
    content: t.String(),
    image: t.String(),
    createdAt: t.Date(),
    author: t.Object({
      id: t.String(),
      name: t.String(),
      image: t.String(),
    }),
    isLiked: t.Boolean(),
    likes: t.Number(),
    comments: t.Number(),
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
  getAll,
  createPost,
  updatePost,
  deletePost,
})
