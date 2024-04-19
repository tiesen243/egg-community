import { z } from 'zod'

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
  email: z.string().email({ message: 'Email is invalid' }),
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

export const deleteAccountSchema = z.object({
  confirm: z.literal('delete my account', {
    errorMap: () => ({ message: 'Please type "delete my account"' }),
  }),
  password: passwordSchema,
})
