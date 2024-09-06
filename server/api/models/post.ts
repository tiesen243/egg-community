import Elysia, { t, type UnwrapSchema } from 'elysia'

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

const author = t.Object({
  id: t.String(),
  name: t.String(),
  image: t.Union([t.String(), t.Null()]),
})

const postCard = t.Array(
  t.Object({
    id: t.String(),
    content: t.String(),
    image: t.Union([t.String(), t.Null()]),
    createdAt: t.Date(),
    author,
    isLiked: t.Boolean(),
    likes: t.Number(),
    comments: t.Number(),
  }),
)

export type TPostCard = UnwrapSchema<typeof postCard>

const e = t.String()

const postDetail = t.Object({
  id: t.String(),
  content: t.String(),
  image: t.String(),
  createdAt: t.Date(),
  author,
  isLiked: t.Boolean(),
  likes: t.Number(),
  comments: t.Number(),
  commentsList: t.Array(
    t.Object({ id: t.String(), content: t.String(), createdAt: t.Date(), author }),
  ),
})

export const postModel = new Elysia({ name: 'Model.Post' }).model({
  // Request
  get,
  createPost,
  updatePost,
  deletePost,

  // Response
  e,
  postCard,
  postDetail,
})
