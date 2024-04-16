'use client'
import type { NextPage } from 'next'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Typography } from '@/components/ui/typography'
import { useMutation } from '@/lib/swr'
import { resetPasswordSchema } from '@/server/models/user.model'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

const Page: NextPage = () => {
  const router = useRouter()
  const { trigger, isMutating, error } = useMutation('reset-password', async (_, { arg }) => {
    const inp = resetPasswordSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    const { data, error } = await api.user['reset-password'].patch(inp.data)
    if (error) throw error.value
    router.push('/auth/login')
    return data
  })
  return (
    // prettier-ignore
    <form action={(fd)=>{ trigger(fd) }}>
      <Typography variant="h1">Reset Password</Typography>
      <Typography>
        Enter your email address and we will send you a link to reset your password.
      </Typography>

      <FormField label="Email" name="email" type="email" message={error?.fieldErrors?.email} />

      <Typography>
        Remember your password?{' '}
        <Typography variant="link" href="/auth/login">
          Login
        </Typography>
      </Typography>

      <Button className="w-full" isLoading={isMutating}>
        Reset Password
      </Button>
    </form>
  )
}

export default Page
