import { createElysia } from '@/server/api/elysia'
import { commentModel } from '@/server/api/models/comment'

export const commentRoute = createElysia({ prefix: '/comment' })
  .use(commentModel)

  // [POST] /api/comment/:id
  .post(
    '/:id',
    async ({ db, params, body, user, error }) => {
      if (!user) return error(401, 'You must be logged in to comment')
      const newCommnet = await db.comment.create({
        data: {
          content: body.content,
          post: { connect: { id: params.id } },
          author: { connect: { id: user.id } },
        },
      })
      if (!newCommnet) return error(500, 'Failed to create comment')
    },
    { body: 'createComment', response: { 401: 'e', 500: 'e' } },
  )

  // [PATCH] /api/comment/:id
  .patch(
    '/:id',
    async ({ db, params: { id }, body, user, error }) => {
      if (!user) return error(401, 'You must be logged in to edit a comment')

      const comment = await db.comment.findUnique({ where: { id } })
      if (!comment) return error(404, 'Comment not found')
      if (comment.authorId !== user.id)
        return error(403, 'You are not allowed to edit this comment')

      const updatedComment = await db.comment.update({
        where: { id },
        data: { content: body.content },
      })
      if (!updatedComment) return error(500, 'Failed to update comment')
    },
    { body: 'updateComment', response: { 401: 'e', 404: 'e', 403: 'e', 500: 'e' } },
  )

  // [DELETE] /api/comment/:id
  .delete(
    '/:id',
    async ({ db, params: { id }, user, error }) => {
      if (!user) return error(401, 'You must be logged in to delete a comment')

      // TODO: Check if user is valid to delete the comment
      const comment = await db.comment.findUnique({ where: { id } })
      if (!comment) return error(404, 'Comment not found')
      if (comment.authorId !== user.id)
        return error(403, 'You are not allowed to delete this comment')

      const deletedCommnet = await db.comment.delete({ where: { id } })
      if (!deletedCommnet) return error(500, 'Failed to delete comment')
    },
    { response: { 401: 'e', 404: 'e', 403: 'e', 500: 'e' } },
  )
