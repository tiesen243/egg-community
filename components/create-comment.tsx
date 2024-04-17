'use client'

import { useRouter } from 'next/navigation'
import { SendHorizonalIcon } from 'lucide-react'
import { useMutation } from '@/lib/swr'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { commentSchema } from '@/server/models/comment.model'

export const CreateComment: React.FC<{ postId: string }> = ({ postId }) => {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const { trigger, isMutating, error } = useMutation('create-comment', async (_, { arg }) => {
    const inp = commentSchema.safeParse(Object.fromEntries(arg.entries()))
    if (!inp.success) throw inp.error.flatten()
    const { data, error } = await api.comment({ id: postId }).post(inp.data)
    if (error) throw error.value
    router.refresh()
    formRef.current?.reset()
    return data
  })

  return (
    /* prettier-ignore */
    <form ref={formRef} action={(fd)=>{ trigger(fd) }} className="fixed bottom-0 -ml-8 w-full max-w-screen-md md:px-8">
      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0 p-4">
          <FormField name="content" placeholder="Write a comment..." className="flex-1" message={error?.fieldErrors?.content} />
          <Button size="icon" isLoading={isMutating}>
            <SendHorizonalIcon />
          </Button>
        </CardHeader>
      </Card>
    </form>
  )
}
