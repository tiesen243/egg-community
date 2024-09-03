import Elysia, { t } from 'elysia'

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

export const userModel = new Elysia({ name: 'Model.User' }).model({
  getUsers,
  getUser,
  signUp,
  signIn,
  update,
  changePassword,
  resetPassword,
  deleteAccount,
})
