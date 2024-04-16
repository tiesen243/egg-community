import Elysia from 'elysia'

import { deleteFile, saveFile } from '@/lib/cloudinary'
import { postModel } from '@/server/models/post.model'
import { context } from '@/server/plugins'

export const postRoute = new Elysia({ name: 'Route.Post', prefix: '/post' })
  .use(context)
  .use(postModel)

  // [POST] /api/post/get-all
  .get(
    '/geta-all',
    async ({ db, query, error }) => {
      const posts = await db.post.findMany({
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
          likes: query.id ? { where: { userId: query.id } } : false,
        },
        orderBy: { createdAt: 'desc' },
        where: query.keyword ? { content: { contains: query.keyword } } : {},
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

  // [GET] /api/post/get-one/:id
  .get(
    '/get-one/:id',
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

  // [POST] /api/post/create
  .post(
    '/create',
    async ({ db, body, user, error }) => {
      if (!user) return error(401, { message: 'You must be logged in to create a post' })
      const image = body.image
        ? await saveFile(body.image, 'post').then((res) => (res?.error ? null : res?.url))
        : null
      const post = await db.post.create({
        data: { content: body.content, image, author: { connect: { id: user.id } } },
      })
      if (!post) return error(500, { message: 'Failed to create post' })
      return { message: 'Post created successfully' }
    },
    { body: 'createPost' },
  )

  // [POST] /api/post/like/:id
  .post('/like/:id', async ({ params: { id }, db, user, error }) => {
    if (!user) return error(401, { message: 'You must be logged in to like a post' })
    const post = await db.post.findUnique({ where: { id } })
    if (!post) return error(404, { message: 'Post not found' })
    const liked = await db.like.findFirst({ where: { postId: id, userId: user.id } })

    if (liked) await db.like.delete({ where: { id: liked.id } })
    else
      await db.like.create({
        data: { post: { connect: { id } }, user: { connect: { id: user.id } } },
      })
  })

  // [DELETE] /api/post/delete/:id
  .delete('/delete-post/:id', async ({ db, params: { id }, user, error }) => {
    if (!user) return error(401, { message: 'You must be logged in to delete a post' })
    const post = await db.post.delete({ where: { id } })
    if (!post) return error(404, { message: 'Post not found' })
    post.image && (await deleteFile(post.image))
    return { message: 'Post deleted successfully' }
  })
