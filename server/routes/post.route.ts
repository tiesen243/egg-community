import Elysia from 'elysia'

import { context } from '@/server/plugins'
import { postModel } from '@/server/models/post.model'

export const postRoute = new Elysia({ name: 'Route.Post', prefix: '/post' })
  .use(context)
  .use(postModel)

  // [POST] /post/create
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
        isLiked: p.likes ? p.likes.length > 0 : false,
        likes: p._count.likes,
        comments: p._count.comments,
      }))
    },
    { query: 'get' },
  )

  // [GET] /post/getOne/:id
  .get(
    '/getOne/:id',
    async ({ db, params: { id }, query, error }) => {
      const post = await db.post.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
          likes: query.id ? { where: { userId: query.id } } : false,
        },
      })

      if (!post) return error(404, { message: 'Post not found' })

      return {
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        author: post.author,
        isLiked: post.likes.length > 0,
        likes: post._count.likes,
        comments: post._count.comments,
      }
    },
    { query: 'get' },
  )
