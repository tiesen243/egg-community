import Elysia, { t } from 'elysia'
import { z } from 'zod'

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

export const userModel = new Elysia({ name: 'Model.User' }).model({
  getUser,
  signUp,
  signIn,
  update,
  changePassword,
  resetPassword,
})

const passwordSchema = z
  .string()
  .regex(
    /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/,
    {
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
    },
  )

export const registerSchema = z
  .object({
    name: z.string().min(4, { message: 'Name must be at least 4 characters long' }),
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
})

export const updateSchema = z.object({
  name: z.optional(z.string().min(4, { message: 'Name must be at least 4 characters long' })),
  bio: z.optional(z.string().min(4, { message: 'Bio must be at least 4 characters long' })),
  avatar: z.optional(z.instanceof(File)),
})

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })

export const resetPasswordSchema = z.object({
  email: z.string().email(),
})
