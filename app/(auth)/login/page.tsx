'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Form, TextField } from '@/components/ui/form'
import { api } from '@/lib/api'
import { loginSchema, type LoginSchema } from '@/lib/validators/user'

const fields = [
  { name: 'email', type: 'email', label: 'Email', placeholder: 'abc@gmail.com' },
  { name: 'password', type: 'password', label: 'Password', placeholder: 'Abcd#12345' },
]

const Page: NextPage = () => {
  const router = useRouter()
  const form = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) })
  const handleSubmit = form.handleSubmit(async (formData: LoginSchema) => {
    const { data, error } = await api.user['sign-in'].post(formData)
    if (error) {
      toast.error(error.value.message)
      return
    }
    toast.success(data.message)
    router.push('/')
    router.refresh()
  })
  const isPending = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-full max-w-screen-md space-y-4">
        {fields.map((field) => (
          <TextField key={field.name} control={form.control} disabled={isPending} {...field} />
        ))}

        <div className="flex flex-col items-end">
          <span className="underline-offset-4 hover:*:underline">
            Don&apos;t have an account? <Link href="/register">Register</Link>
          </span>

          <span className="underline-offset-4 hover:*:underline">
            Forgot your password? <Link href="/forgot-password">Reset</Link>
          </span>
        </div>

        <Button className="w-full" isLoading={isPending}>
          Login
        </Button>
      </form>
    </Form>
  )
}

export default Page
