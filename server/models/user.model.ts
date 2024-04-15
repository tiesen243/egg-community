import Elysia, { t } from 'elysia'
import { z } from 'zod'

const signUp = t.Object({
  name: t.String(),
  email: t.String(),
  password: t.String(),
  confirmPassword: t.String(),
})

const signIn = t.Omit(signUp, ['name', 'confirmPassword'])

const getUser = t.Partial(t.Object({ id: t.String() }))

export const userModel = new Elysia({ name: 'Model.User' }).model({ signUp, signIn, getUser })

export const registerSchema = z
  .object({
    name: z.string().min(4, { message: 'Name must be at least 4 characters long' }),
    email: z.string().email(),
    password: z
      .string()
      .regex(
        /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/,
        {
          message:
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/,
      {
        message:
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      },
    ),
})
