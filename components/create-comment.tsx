'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SendHorizonalIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import * as f from '@/components/ui/form'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'
import { Input } from './ui/input'

const schema = z.object({ content: z.string().min(1, 'Content is required') })
export const CreateComment: React.FC<{ postId: string }> = ({ postId }) => {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (values) => {
    await api.comment({ id: postId }).post(values)
    form.reset({ content: '' })
    await revalidate('posts')
  })
  const isPending = form.formState.isSubmitting

  return (
    <f.Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 z-20 -ml-8 w-full max-w-screen-md md:px-8"
      >
        <Card className="w-full rounded-none">
          <CardHeader className="flex-row items-center gap-2 space-y-0 p-4">
            <f.FormField
              name="content"
              control={form.control}
              disabled={isPending}
              render={({ field }) => (
                <f.FormControl className="flex-grow">
                  <Input {...field} placeholder="Write a comment..." className="w-full" />
                </f.FormControl>
              )}
            />
            <Button size="icon" isLoading={isPending}>
              <SendHorizonalIcon />
            </Button>
          </CardHeader>
        </Card>
      </form>
    </f.Form>
  )
}
