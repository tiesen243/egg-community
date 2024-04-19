import Elysia, { t } from 'elysia'

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
