import Elysia from 'elysia'
import { Scrypt } from 'lucia'
import { cookies } from 'next/headers'

import { db } from '@/prisma'
import { userModel } from '@/server/models/user.model'
import { context } from '@/server/plugins'
import { lucia } from '@/server/auth/lucia'
import { saveFile } from '@/lib/cloudinary'

export const userRoute = new Elysia({ name: 'Route.User', prefix: '/user' })
  .use(context)
  .use(userModel)

  // [GET] /api/user/:id
  .get(
    '/info/:id',
    async ({ db, params: { id }, query, error }) => {
      const user = await db.user.findUnique({
        where: { id },
        include: {
          posts: {
            include: {
              author: { select: { id: true, name: true, image: true } },
              _count: { select: { likes: true, comments: true } },
              likes: query.id ? { where: { userId: query.id } } : false,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { posts: true, followers: true, following: true },
          },
        },
      })
      if (!user) return error(404, { message: 'User not found' })

      const isFollowing = query?.id
        ? await db.user.findFirst({
            where: { id: query.id, followers: { some: { id } } },
          })
        : false

      const posts = user.posts.map((p) => ({
        id: p.id,
        content: p.content,
        image: p.image,
        createdAt: p.createdAt,
        author: p.author,
        isLiked: p.likes ? p.likes.length > 0 : false,
        likes: p._count.likes,
        comments: p._count.comments,
      }))

      return { ...user, password: '', posts, isFollowing: !!isFollowing }
    },
    { query: 'getUser' },
  )

  // [POST] /user/sign-up
  .post(
    '/sign-up',
    async ({ db, body, error }) => {
      const user = await db.user.findUnique({ where: { email: body.email } })
      if (user) return error(409, { message: 'User already exists' })

      const hash = await new Scrypt().hash(body.password)
      const newUser = await db.user.create({ data: { ...body, password: hash } })
      if (!newUser) return error(500, { message: 'Failed to create user' })
      return { message: 'User created successfully' }
    },
    { body: 'signUp' },
  )

  // [POST] /user/sign-in
  .post(
    '/sign-in',
    async ({ body: { email, password }, error }) => {
      const user = await db.user.findUnique({ where: { email: email } })
      if (!user) return error(404, { message: 'User not found' })

      const isValid = await new Scrypt().verify(user.password, password)
      if (!isValid) return error(401, { message: 'Invalid password' })

      const session = await lucia.createSession(user.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

      return { message: 'User signed in successfully' }
    },
    { body: 'signIn' },
  )

  // [POST] /user/sign-out
  .post('/sign-out', async () => {
    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  })

  .onBeforeHandle(({ user, error }) => !user && error(401, { message: 'Unauthorized' }))

  // [PATCH] /user/update
  .patch(
    '/update',
    async ({ db, user, body, error }) => {
      const newAvatar = await saveFile(body.avatar!, 'avatar').then((res) =>
        res?.error ? user?.image : res?.url,
      )

      const newUser = await db.user.update({
        where: { id: user?.id },
        data: {
          name: body.name ?? user?.name,
          bio: body.bio ?? user?.bio,
          image: newAvatar,
        },
      })
      if (!newUser) return error(500, { message: 'Failed to update user' })
      return { message: 'User updated successfully' }
    },
    { body: 'update' },
  )
