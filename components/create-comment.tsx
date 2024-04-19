'use client'

import { SendHorizonalIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

import { useMutation } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { api } from '@/lib/api'
import { commentSchema } from '@/lib/validators/comment'

export const CreateComment: React.FC<{ postId: string }> = ({ postId }) => {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const { trigger, isMutating, fieldErrors } = useMutation(async (arg) => {
    const inp = commentSchema.parse(Object.fromEntries(arg.entries()))
    const { error } = await api.comment({ id: postId }).post(inp)
    if (error) throw new Error(error.value)
    router.refresh()
    formRef.current?.reset()
  })

  return (
    <form
      ref={formRef}
      action={trigger}
      className="fixed bottom-0 z-20 -ml-8 w-full max-w-screen-md md:px-8"
    >
      <Card className="rounded-none">
        <CardHeader className="flex-row items-center gap-2 space-y-0 p-4">
          <FormField
            name="content"
            placeholder="Write a comment..."
            className="flex-1"
            message={fieldErrors?.content?.at(0)}
          />
          <Button size="icon" isLoading={isMutating}>
            <SendHorizonalIcon />
          </Button>
        </CardHeader>
      </Card>
    </form>
  )
}
