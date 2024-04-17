'use client'

import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Typography } from '@/components/ui/typography'
import { api } from '@/lib/api'
import { loginSchema } from '@/server/models/user.model'
import { useMutation } from '@/lib/swr'

const Page: NextPage = () => {
  const router = useRouter()
  const { trigger, isMutating, error } = useMutation('login', async (_, { arg }) => {
    const inp = loginSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    const { data, error } = await api.user['sign-in'].post(inp.data)
    if (error) throw error.value
    router.push('/')
    router.refresh()
    return data
  })

  return (
    // prettier-ignore
    <form action={(fd)=>{ trigger(fd) }} className='container max-w-screen-md space-y-4'>
      <Typography variant="h1">Login</Typography>
      <Typography>
        Welcome back! Please login to continue sharing your thoughts with the community.
      </Typography>

      <FormField label="Email" name="email" type="email" message={error?.fieldErrors?.email} />
      <FormField
        label="Password"
        name="password"
        type="password"
        message={error?.fieldErrors?.password}
      />

      <div className="flex flex-col justify-between gap-2 md:flex-row">
        <p>
          Don&apos;t have an account?{' '}
          <Typography variant="link" href="/auth/register">
            Register
          </Typography>
        </p>

        <p>
          Forgot your password?{' '}
          <Typography variant="link" href="/auth/forgot-password">
            Reset
          </Typography>
        </p>
      </div>
      <Button type="submit" className="w-full" isLoading={isMutating}>
        Login
      </Button>
    </form>
  )
}

export default Page
