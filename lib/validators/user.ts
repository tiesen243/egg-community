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
export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email is invalid' }),
  password: passwordSchema,
})
export type LoginSchema = z.infer<typeof loginSchema>

export const updateSchema = z.object({
  name: z.optional(z.string().min(4, { message: 'Name must be at least 4 characters long' })),
  bio: z.optional(z.string().min(4, { message: 'Bio must be at least 4 characters long' })),
  avatar: z.optional(z.instanceof(File)),
})
export type UpdateSchema = z.infer<typeof updateSchema>

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
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email(),
})
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export const deleteAccountSchema = z.object({
  confirm: z.literal('delete my account', {
    errorMap: () => ({ message: 'Please type "delete my account"' }),
  }),
  password: passwordSchema,
})
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>
