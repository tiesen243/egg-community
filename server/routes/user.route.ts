import Elysia from 'elysia'
import { Scrypt } from 'lucia'
import { cookies } from 'next/headers'

import { db } from '@/prisma'
import { userModel } from '@/server/models/user.model'
import { context } from '@/server/plugins'
import { lucia } from '@/server/auth/lucia'
import { deleteFile, saveFile } from '@/lib/cloudinary'
import { env } from '@/env.mjs'

export const userRoute = new Elysia({ name: 'Route.User', prefix: '/user' })
  .use(context)
  .use(userModel)

  // [GET] /api/user/get-all
  .get(
    '/get-all',
    async ({ db, query, error }) => {
      const users = await db.user.findMany({
        select: { id: true, name: true, image: true },
        orderBy: { createdAt: 'desc' },
        where: query.keyword ? { name: { contains: query.keyword } } : {},
      })
      if (!users) return error(404, { message: 'Users not found' })

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

  // [POST] /api/user/sign-up
  .post(
    '/sign-up',
    async ({ db, body, error }) => {
      const { name, email } = body
      const user = await db.user.findUnique({ where: { email } })
      if (user) return error(409, { message: 'User already exists' })

      const password = await new Scrypt().hash(body.password)
      const newUser = await db.user.create({ data: { name, email, password } })
      if (!newUser) return error(500, { message: 'Failed to create user' })

      fetch(env.SEND_EMAIL, {
        method: 'POST',
        body: JSON.stringify({
          from: 'Egg Community',
          to: email,
          reply_to: env.EMAIL,
          subject: 'Welcome to Egg Community',
          message: `Hello ${newUser.name}, your account has been successfully created!<br>Thank you for joining us!`,
        }),
      })

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
      if (!isValid) return error(401, { message: 'Password is incorrect' })

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

  // [PATCH] /user/update
  .patch(
    '/update',
    async ({ db, user, body, error }) => {
      if (!user) return error(401, { message: 'Unauthorized' })

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
      if (!newUser) return error(500, { message: 'Failed to update user' })

      if (body.avatar && user?.image) await deleteFile(user.image)
      return { message: 'User updated successfully' }
    },
    { body: 'update' },
  )

  // [PATCH] /user/change-password
  .patch(
    '/change-password',
    async ({ db, user, body, error }) => {
      if (!user) return error(401, { message: 'Unauthorized' })
      const isValid = await new Scrypt().verify(user.password, body.oldPassword)
      if (!isValid) return error(401, { message: 'Password is incorrect' })

      const newUser = await db.user.update({
        where: { id: user.id },
        data: { password: await new Scrypt().hash(body.newPassword) },
      })
      if (!newUser) return error(500, { message: 'Failed to update password' })

      fetch(env.SEND_EMAIL, {
        method: 'POST',
        body: JSON.stringify({
          from: 'Egg Community',
          to: user.email,
          reply_to: env.EMAIL,
          subject: 'Password Changed',
          message: `Hello ${user.name}, your password has been successfully changed!<br>If you didn't do this, please contact us immediately.`,
        }),
      })

      return { message: 'Password changed successfully' }
    },
    { body: 'changePassword' },
  )

  // [PATCH] /user/reset-password
  .patch(
    '/reset-password',
    async ({ db, body, error }) => {
      const user = await db.user.findUnique({ where: { email: body.email } })
      if (!user) return error(404, { message: 'User not found' })

      const newPassword = `Egg#${Math.floor(1000000 + Math.random() * 9000000)}`
      const newUser = await db.user.update({
        where: { id: user.id },
        data: { password: await new Scrypt().hash(newPassword) },
      })
      if (!newUser) return error(500, { message: 'Failed to reset password' })

      fetch(env.SEND_EMAIL, {
        method: 'POST',
        body: JSON.stringify({
          from: 'Egg Community',
          to: user.email,
          reply_to: env.EMAIL,
          subject: 'Password Reset',
          message: `Hello ${user.name}, your password has been successfully reset!<br>Your new password is: <b>${newPassword}</b>`,
        }),
      })

      return { message: 'Password reset successfully' }
    },
    { body: 'resetPassword' },
  )

  // [DELETE] /user/delete
  .delete('/delete-account', async ({ db, user, error }) => {
    if (!user) return error(401, { message: 'You are not authorized' })

    const deletedUser = await db.user.delete({ where: { id: user.id } })
    if (!deletedUser) return error(500, { message: 'Failed to delete user' })
    if (user.image) await deleteFile(user.image)

    fetch(env.SEND_EMAIL, {
      method: 'POST',
      body: JSON.stringify({
        from: 'Egg Community',
        to: user.email,
        reply_to: env.EMAIL,
        subject: 'Account Deleted',
        message: `Hello ${user.name}, your account has been successfully deleted!<br>We're sorry to see you go!`,
      }),
    })

    return { message: 'User deleted successfully' }
  })
