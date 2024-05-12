'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SendHorizonalIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Form, TextField } from '@/components/ui/form'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'

const schema = z.object({ content: z.string().min(1, 'Content is required') })
export const CreateComment: React.FC<{ postId: string }> = ({ postId }) => {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const handleSubmit = form.handleSubmit(async (formData) => {
    await api.comment({ id: postId }).post(formData)
    form.reset({ content: '' })
    revalidate('posts')
  })
  const isPending = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 z-20 -ml-8 w-full max-w-screen-md md:px-8"
      >
        <Card className="w-full rounded-none">
          <CardHeader className="flex-row items-center gap-2 space-y-0 p-4">
            <TextField
              name="content"
              control={form.control}
              placeholder="Write a comment"
              disabled={isPending}
              classes={{ item: 'w-full' }}
            />
            <Button size="icon" isLoading={isPending}>
              <SendHorizonalIcon />
            </Button>
          </CardHeader>
        </Card>
      </form>
    </Form>
  )
}
