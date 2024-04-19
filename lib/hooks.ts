import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { ZodError } from 'zod'

export const useMutation = <TData = unknown>(fetcher: (arg: FormData) => Promise<TData>) => {
  const [isMutating, setIsMutating] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({})

  const trigger = useCallback(
    (arg: FormData) => {
      const fetch = async (arg: FormData) => {
        setIsMutating(true)
        setFieldErrors({})

        try {
          const data = await fetcher(arg)
          if (data) toast.success(String(data?.message))
        } catch (e) {
          if (e instanceof ZodError) setFieldErrors(e.flatten().fieldErrors)
          else if (e instanceof Error) toast.error(e.message)
        } finally {
          setIsMutating(false)
        }
      }

      fetch(arg)
    },
    [fetcher],
  )

  return { trigger, isMutating, fieldErrors }
}
