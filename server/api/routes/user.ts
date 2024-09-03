import { Scrypt } from 'lucia'
import { cookies } from 'next/headers'

import { deleteFile, saveFile } from '@/lib/cloudinary'
import { createElysia } from '@/server/api/elysia'
import { userModel } from '@/server/api/models/user'
import { lucia } from '@/server/auth/lucia'
import { sendEmail } from '@/server/email/action'

export const userRoute = createElysia({ name: 'Route.User', prefix: '/user' })
  .use(userModel)

  // [GET] /api/user/get-all
  .get(
    '/get-all',
    async ({ db, query, error }) => {
      const users = await db.user.findMany({
        where: query.keyword ? { name: { contains: query.keyword, mode: 'insensitive' } } : {},
        select: { id: true, name: true, image: true },
        orderBy: { createdAt: 'desc' },
      })
      if (!users) return error(404, 'Users not found')

      return users
    },
    { query: 'getUsers' },
  )

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
          _count: { select: { posts: true, followers: true, following: true } },
        },
      })
      if (!user) return error(404, 'User not found')

      const isFollowing = query.id
        ? await db.user.findFirst({
            where: { id, followers: { some: { id: query.id } } },
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

  // [GET] /api/user/:id/following
  .get('/:id/following', async ({ db, params: { id }, error }) => {
    const user = await db.user.findUnique({
      where: { id },
      include: { following: { select: { id: true, name: true, image: true } } },
    })
    if (!user) return error(404, 'User not found')

    return { name: user.name, users: user.following }
  })

  // [GET] /api/user/:id/followers
  .get('/:id/followers', async ({ db, params: { id }, error }) => {
    const user = await db.user.findUnique({
      where: { id },
      include: { followers: { select: { id: true, name: true, image: true } } },
    })
    if (!user) return error(404, 'User not found')

    return { name: user.name, users: user.followers }
  })

  // [POST] /api/user/sign-up
  .post(
    '/sign-up',
    async ({ db, body, error }) => {
      const { name, email } = body
      const user = await db.user.findUnique({ where: { email } })
      if (user) return error(409, 'User already exists')

      const password = await new Scrypt().hash(body.password)
      const newUser = await db.user.create({ data: { name, email, password } })
      if (!newUser) return error(500, 'Failed to create user')

      await sendEmail({ email, name, subject: 'Welcome to Egg Community', type: 'welcome' })

      return { message: 'User created successfully' }
    },
    { body: 'signUp' },
  )

  // [POST] /api/user/sign-in
  .post(
    '/sign-in',
    async ({ body: { email, password }, db, error }) => {
      const user = await db.user.findUnique({ where: { email: email } })
      if (!user) return error(404, 'User not found')

      const isValid = await new Scrypt().verify(user.password, password)
      if (!isValid) return error(401, 'Password is incorrect')

      const session = await lucia.createSession(user.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

      return { message: 'User signed in successfully' }
    },
    { body: 'signIn' },
  )

  // [POST] /api/user/sign-out
  .post('/sign-out', async () => {
    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  })

  // [POST] /api/user/follow
  .post(
    '/follow',
    async ({ db, user, body: { id }, error }) => {
      if (!user) return error(401, 'You are not authorized to follow')

      const userToFollow = await db.user.findUnique({ where: { id } })
      if (!userToFollow) return error(404, 'User not found')

      let addedFollow = false
      const followed = await db.user.findFirst({
        where: { id, followers: { some: { id: user.id } } },
      })
      if (followed) {
        await db.user.update({
          where: { id },
          data: { followers: { disconnect: { id: user.id } } },
        })
        addedFollow = false
      } else {
        await db.user.update({
          where: { id },
          data: { followers: { connect: { id: user.id } } },
        })
        addedFollow = true
      }

      return {
        message: `${addedFollow ? 'Followed' : 'Unfollowed'} ${userToFollow.name}`,
        addedFollow,
      }
    },
    { body: 'getUser' },
  )

  // [PATCH] /api/user/update
  .patch(
    '/update',
    async ({ db, user, body, error }) => {
      if (!user) return error(401, 'Unauthorized')

      const newAvatar = await saveFile(body.avatar!, 'avatar').then((res) =>
        res?.error ? user.image : res?.url,
      )

      const newUser = await db.user.update({
        where: { id: user?.id },
        data: {
          name: body.name ?? user?.name,
          bio: body.bio ?? user?.bio,
          image: newAvatar,
        },
      })
      if (!newUser) return error(500, 'Failed to update user')

      if (body.avatar && user?.image) await deleteFile(user.image)
      return { message: 'User updated successfully' }
    },
    { body: 'update' },
  )

  // [PATCH] /api/user/change-password
  .patch(
    '/change-password',
    async ({ db, user, body, error }) => {
      if (!user) return error(401, 'Unauthorized')

      const isValid = await new Scrypt().verify(user.password, body.oldPassword)
      if (!isValid) return error(401, 'Password is incorrect')

      const newUser = await db.user.update({
        where: { id: user.id },
        data: { password: await new Scrypt().hash(body.newPassword) },
      })
      if (!newUser) return error(500, 'Failed to update password')

      return { message: 'Password changed successfully' }
    },
    { body: 'changePassword' },
  )

  // [PATCH] /api/user/reset-password
  .patch(
    '/reset-password',
    async ({ db, body, error }) => {
      const user = await db.user.findUnique({ where: { email: body.email } })
      if (!user) return error(404, 'User not found')

      const newPassword = `Egg#${Math.floor(1000000 + Math.random() * 9000000)}`
      const newUser = await db.user.update({
        where: { id: user.id },
        data: { password: await new Scrypt().hash(newPassword) },
      })
      if (!newUser) return error(500, 'Failed to reset password')

      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        type: 'reset-password',
        data: { newPassword },
      })

      return { message: 'Password reset successfully' }
    },
    { body: 'resetPassword' },
  )

  // [DELETE] /api/user/delete
  .delete(
    '/delete-account',
    async ({ db, user, body: { password }, error }) => {
      if (!user) return error(401, 'You are not authorized')

      const isValid = await new Scrypt().verify(user.password, password)
      if (!isValid) return error(401, 'Password is incorrect')

      const deletedUser = await db.user.delete({ where: { id: user.id } })
      if (!deletedUser) return error(500, 'Failed to delete user')
      if (user.image) await deleteFile(user.image)

      await sendEmail({
        email: user.email,
        name: user.name,
        subject: 'Account Deleted',
        type: 'delete-account',
      })

      return { message: 'User deleted successfully' }
    },
    { body: 'deleteAccount' },
  )
