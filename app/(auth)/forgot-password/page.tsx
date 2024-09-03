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

const schema = z.object({ email: z.string().email('Email is invalid') })

const Page: NextPage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    const { error } = await api.user['reset-password'].patch(formData)
    if (error) return toast.error(error.value)
    toast.success('New password sent to your email')
    router.push('/')
    router.refresh()
  })
  const { isSubmitting } = form.formState

  return (
    <f.Form {...form}>
      <form onSubmit={handleSubmit} className="w-full max-w-screen-md space-y-4 px-4">
        <f.FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <f.FormItem>
              <f.FormLabel>Email</f.FormLabel>
              <f.FormControl>
                <Input {...field} type="email" placeholder="abc@gmail.com" />
              </f.FormControl>
              <f.FormMessage />
            </f.FormItem>
          )}
        />

        <div className="flex flex-col items-end">
          <span className="underline-offset-4 hover:*:underline">
            Already have an account? <Link href="/login">Login</Link>
          </span>

          <span className="underline-offset-4 hover:*:underline">
            Don&apos;t have an account? <Link href="/register">Register</Link>
          </span>
        </div>

        <Button className="w-full" isLoading={isSubmitting}>
          Reset
        </Button>
      </form>
    </f.Form>
  )
}

export default Page
