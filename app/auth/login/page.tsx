'use client'

import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { useMutation } from '@/lib/hooks'
import { loginSchema } from '@/lib/validators/user'

const Page: NextPage = () => {
  const router = useRouter()
  const { trigger, isMutating, fieldErrors } = useMutation(async (fd: FormData) => {
    const inp = loginSchema.parse(Object.fromEntries(fd))
    const { data, error } = await api.user['sign-in'].post(inp)
    if (error) throw new Error(error.value.message)
    router.push('/')
    router.refresh()
    return data.message
  })

  return (
    <form action={trigger} className="container max-w-screen-md space-y-4">
      <h2 className="text-center text-4xl font-bold">Login</h2>

      <FormField
        label="Email"
        name="email"
        type="email"
        message={fieldErrors?.email?.at(0)}
        disabled={isMutating}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        message={fieldErrors?.password?.at(0)}
        disabled={isMutating}
      />

      <div className="flex flex-col md:flex-row md:justify-between">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="underline-offset-4 hover:underline">
            Register
          </Link>
        </p>

        <p>
          Forgot your password?{' '}
          <Link href="/auth/forgot-password" className="underline-offset-4 hover:underline">
            Reset password
          </Link>
        </p>
      </div>

      <Button type="submit" className="w-full" isLoading={isMutating}>
        Login
      </Button>
    </form>
  )
}

export default Page
