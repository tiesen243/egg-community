import { createElysia } from '@/server/api/elysia'
import { postModel } from '@/server/api/models/post'
import { deleteFile, saveFile } from '@/server/cloudinary'

export const postRoute = createElysia({ name: 'Route.Post', prefix: '/post' })
  .use(postModel)

  // [POST] /api/post/getAll
  .get(
    '/getAll',
    async ({ db, query, error }) => {
      const posts = await db.post.findMany({
        where: query.keyword ? { content: { contains: query.keyword, mode: 'insensitive' } } : {},
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
          likes: query.id ? { where: { userId: query.id } } : false,
        },
        orderBy: { createdAt: 'desc' },
      })

      if (!posts) return error(404, 'Posts not found')

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
    { query: 'get', response: { 200: 'postCard', 404: 'e' } },
  )

  // [GET] /api/post/getOne/:id
  .get(
    '/getOne/:id',
    // @ts-expect-error - query type is not defined
    async ({ db, params: { id }, query, error }) => {
      const post = await db.post.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
          likes: query.id ? { where: { userId: query.id } } : false,
          comments: { include: { author: { select: { id: true, name: true, image: true } } } },
        },
      })

      if (!post) return error(404, 'Post not found')

      return {
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        author: post.author,
        isLiked: post.likes ? post.likes.length > 0 : false,
        likes: post._count.likes,
        comments: post._count.comments,
        commentsList: post.comments,
      }
    },
    { query: 'get', response: { 200: 'postDetail', 404: 'e' } },
  )

  // [GET] /api/post/getByFollowing
  .get(
    '/getByFollowing',
    async ({ db, query, error }) => {
      const posts = await db.post.findMany({
        where: { author: { followers: { some: { id: query.id } } } },
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
          likes: query.id ? { where: { userId: query.id } } : false,
        },
        orderBy: { createdAt: 'desc' },
      })

      if (!posts) return error(404, 'Posts not found')

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
    { query: 'get', response: { 200: 'postCard', 404: 'e' } },
  )

  // [POST] /api/post/create
  .post(
    '/create',
    async ({ db, body, user, error }) => {
      if (!user) return error(401, 'You must be logged in to create a post')
      const image = body.image
        ? await saveFile(body.image, 'post').then((res) => (res?.error ? null : res?.url))
        : null
      const post = await db.post.create({
        data: { content: body.content, image, author: { connect: { id: user.id } } },
      })
      if (!post) return error(500, 'Failed to create post')
      return { message: 'Post created successfully' }
    },
    { body: 'createPost' },
  )

  // [POST] /api/post/like/:id
  .post(
    '/like/:id',
    async ({ params: { id }, db, user, error }) => {
      if (!user) return error(401, 'You must be logged in to like a post')
      const post = await db.post.findUnique({ where: { id } })

      if (!post) return error(404, 'Post not found')
      const liked = await db.like.findFirst({ where: { postId: id, userId: user.id } })

      if (liked) await db.like.delete({ where: { id: liked.id } })
      else
        await db.like.create({
          data: { post: { connect: { id } }, user: { connect: { id: user.id } } },
        })
    },
    { response: { 401: 'e', 404: 'e' } },
  )

  // [PATCH] /api/post/update/:id
  .patch(
    '/update/:id',
    async (ctx) => {
      if (!ctx.user) return ctx.error(401, 'You must be logged in to update a post')

      const post = await ctx.db.post.findUnique({ where: { id: ctx.params.id } })
      if (!post) return ctx.error(404, 'Post not found')

      if (post.authorId !== ctx.user.id) return ctx.error(403, 'You are not a author of this post')

      const image = ctx.body.image
        ? await saveFile(ctx.body.image, 'post').then((res) => (res?.error ? null : res?.url))
        : null

      await ctx.db.post.update({
        where: { id: ctx.params.id },
        data: { content: ctx.body.content, image },
      })
      if (!post) return ctx.error(500, 'Failed to update post')

      if (post.image && image) await deleteFile(post.image)
      return { message: 'Post updated successfully' }
    },
    { body: 'updatePost', response: { 401: 'e', 403: 'e', 404: 'e', 500: 'e' } },
  )

  // [DELETE] /api/post/deletePost/:id
  .delete(
    '/deletePost/:id',
    async ({ db, params: { id }, user, error }) => {
      if (!user) return error(401, 'You must be logged in to delete a post')

      const post = await db.post.delete({ where: { id } })
      if (!post) return error(404, 'Post not found')

      if (post.image) await deleteFile(post.image)

      return { message: 'Post deleted successfully' }
    },
    { response: { 401: 'e', 404: 'e' } },
  )
