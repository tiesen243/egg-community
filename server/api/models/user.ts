import Elysia, { t, UnwrapSchema } from 'elysia'

const getUsers = t.Partial(t.Object({ keyword: t.String() }))

const getUser = t.Partial(t.Object({ id: t.String() }))

const signUp = t.Object({
  name: t.String(),
  email: t.String(),
  password: t.String(),
  confirmPassword: t.String(),
})

const signIn = t.Omit(signUp, ['name', 'confirmPassword'])

const update = t.Partial(
  t.Object({
    name: t.String(),
    bio: t.String(),
    avatar: t.String(),
  }),
)

const changePassword = t.Object({
  oldPassword: t.String(),
  newPassword: t.String(),
  confirmNewPassword: t.String(),
})

const resetPassword = t.Object({
  email: t.String(),
})

const deleteAccount = t.Object({
  password: t.String(),
  confirm: t.String(),
})

const e = t.String({})
const res = t.Object({ message: t.String(), addedFollow: t.Optional(t.Boolean()) })

const getUsersRes = t.Array(
  t.Object({ id: t.String(), name: t.String(), image: t.Union([t.String(), t.Null()]) }),
)

const getUserRes = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  bio: t.String(),
  image: t.Union([t.String(), t.Null()]),
  _count: t.Object({ posts: t.Number(), followers: t.Number(), following: t.Number() }),
  isFollowing: t.Boolean(),
  createdAt: t.Date(),
  posts: t.Array(
    t.Object({
      id: t.String(),
      content: t.String(),
      image: t.Union([t.String(), t.Null()]),
      createdAt: t.Date(),
      author: t.Object({
        id: t.String(),
        name: t.String(),
        image: t.Union([t.String(), t.Null()]),
      }),
      isLiked: t.Boolean(),
      likes: t.Number(),
      comments: t.Number(),
    }),
  ),
})

export type User = UnwrapSchema<typeof getUserRes>

const getFollowRes = t.Object({
  name: t.String(),
  users: t.Array(
    t.Object({ id: t.String(), name: t.String(), image: t.Union([t.String(), t.Null()]) }),
  ),
})

export const userModel = new Elysia({ name: 'Model.User' }).model({
  getUsers,
  getUser,
  signUp,
  signIn,
  update,
  changePassword,
  resetPassword,
  deleteAccount,

  // Response
  e,
  res,
  getUsersRes,
  getUserRes,
  getFollowRes,
})
