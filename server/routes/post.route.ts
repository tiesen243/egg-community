import Elysia from 'elysia'

import { context } from '@/server/plugins'
import { postModel } from '@/server/models/post.model'

export const postRoute = new Elysia({ name: 'Route.Post', prefix: '/post' })
  .use(context)
  .use(postModel)

  .get(
    '/getAll',
    async ({ db, query, error }) => {
      const posts = await db.post.findMany({
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
          likes: query.id ? { where: { userId: query.id } } : false,
        },
        orderBy: { createdAt: 'desc' },
      })

      if (!posts) return error(404, { message: 'Posts not found' })

      return posts.map((p) => ({
        id: p.id,
        content: p.content,
        image: p.image,
        createdAt: p.createdAt,
        author: p.author,
        isLiked: p.likes.length > 0,
        likes: p._count.likes,
        comments: p._count.comments,
      }))
    },
    { query: 'getAll' },
  )
