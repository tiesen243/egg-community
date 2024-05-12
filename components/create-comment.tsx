'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SendHorizonalIcon } from 'lucide-react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Form, TextField } from '@/components/ui/form'
import { api } from '@/lib/api'
import { revalidate } from '@/lib/revalidate'
import { commentSchema, type CommentSchema } from '@/lib/validators/comment'

export const CreateComment: React.FC<{ postId: string }> = ({ postId }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useForm<CommentSchema>({ resolver: zodResolver(commentSchema) })
  const handleSubmit = form.handleSubmit(async (formData: CommentSchema) => {
    await api.comment({ id: postId }).post(formData)
    form.reset()
    revalidate('posts')
  })
  const isPending = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="fixed bottom-0 z-20 -ml-8 w-full max-w-screen-md md:px-8"
      >
        <Card className="rounded-none">
          <CardHeader className="flex-row items-center gap-2 space-y-0 p-4">
            <TextField
              name="content"
              control={form.control}
              placeholder="Write a comment"
              disabled={isPending}
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
