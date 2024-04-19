'use client'

import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { useMutation } from '@/lib/hooks'
import { registerSchema } from '@/lib/validators/user'

const Page: NextPage = () => {
  const router = useRouter()
  const { trigger, isMutating, fieldErrors } = useMutation(async (fd: FormData) => {
    const inp = registerSchema.parse(Object.fromEntries(fd))
    const { data, error } = await api.user['sign-up'].post(inp)
    if (error) throw new Error(error.value.message)
    router.push('/auth/login')
    return data
  })

  return (
    <form action={trigger} className="container max-w-screen-md space-y-4">
      <h2 className="text-center text-4xl font-bold">Login</h2>

      <FormField
        label="Name"
        name="name"
        message={fieldErrors?.email?.at(0)}
        disabled={isMutating}
      />
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
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        message={fieldErrors?.confirmPassword?.at(0)}
        disabled={isMutating}
      />

      <p>
        Already have an account?{' '}
        <Link href="/auth/login" className="underline-offset-4 hover:underline">
          Login
        </Link>
      </p>

      <Button type="submit" className="w-full" isLoading={isMutating}>
        Register
      </Button>
    </form>
  )
}

export default Page
