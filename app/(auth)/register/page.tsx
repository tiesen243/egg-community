'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import * as f from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const schema = z
  .object({
    name: z.string().min(4, 'Name is too short'),
    email: z.string().email('Email is invalid'),
    password: z.string().min(8, 'Password is too short'),
    confirmPassword: z.string().min(8, 'Password is too short'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

const fields = [
  { name: 'name', type: 'text', label: 'Name', placeholder: 'Yukikaze' },
  { name: 'email', type: 'email', label: 'Email', placeholder: 'abc@gmail.com' },
  { name: 'password', type: 'password', label: 'Password', placeholder: 'Abcd#12345' },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Abcd#12345',
  },
]

const Page: NextPage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    const { error } = await api.user['sign-up'].post(formData)
    if (error) return toast.error(error.value)
    toast.success('Account created successfully')
    router.push('/')
    router.refresh()
  })
  const { isSubmitting, errors } = form.formState

  return (
    <f.Form {...form}>
      <form onSubmit={handleSubmit} className="w-full max-w-screen-md space-y-4 px-4">
        {fields.map((fs) => (
          <f.FormField
            key={fs.name}
            control={form.control}
            name={fs.name}
            render={({ field }) => (
              <f.FormItem>
                <f.FormLabel>{fs.label}</f.FormLabel>
                <f.FormControl>
                  <Input {...field} {...fs} />
                </f.FormControl>
                <f.FormMessage />
              </f.FormItem>
            )}
          />
        ))}

        <div className="flex flex-col items-end">
          <span className="underline-offset-4 hover:*:underline">
            Already have an account? <Link href="/login">Login</Link>
          </span>

          <span className="underline-offset-4 hover:*:underline">
            Forgot your password? <Link href="/forgot-password">Reset</Link>
          </span>
        </div>
        <Button className="w-full" isLoading={isSubmitting}>
          Register
        </Button>
      </form>
    </f.Form>
  )
}

export default Page
