'use client'

import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { Typography } from '@/components/ui/typography'

const Page: NextPage = () => {
  const router = useRouter()
  const { trigger, isMutating, error } = useSWRMutation<unknown, Error, string, FormData>(
    'login',
    async (_, { arg }) => {
      const body = Object.fromEntries(arg.entries()) as {
        name: string
        email: string
        password: string
      }
      const { data, error } = await api.user['sign-up'].post(body)
      if (error) throw error.value
      return data
    },
  )

  return (
    <form
      action={(fd: FormData) => {
        trigger(fd).then(() => router.push('/auth/login'))
      }}
    >
      <Typography variant="h1">Register</Typography>
      <Typography>Create an account to start sharing your thoughts with the community.</Typography>

      <FormField label="Name" name="name" message={error?.fieldErrors?.name} />
      <FormField label="Email" name="email" type="email" message={error?.fieldErrors?.email} />
      <FormField
        label="Password"
        name="password"
        type="password"
        message={error?.fieldErrors?.password}
      />

      <p>
        Already have an account?{' '}
        <Typography variant="link" href="/auth/login">
          Login
        </Typography>
      </p>
      <Button type="submit" className="w-full" isLoading={isMutating}>
        Register
      </Button>
    </form>
  )
}

export default Page
