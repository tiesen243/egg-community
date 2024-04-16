import { toast } from 'sonner'
import type { Key } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'

export const useMutation = (
  key: Key,
  fetcher: (key: Key, options: Readonly<{ arg: FormData }>) => Promise<{ message: string } | void>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: SWRMutationConfiguration<any, Error>,
) =>
  useSWRMutation<{ message: string } | void, Error, Key, FormData>(key, fetcher, {
    ...config,
    onError: (error) => !error.fieldErrors && toast.error(error.message),
    onSuccess: (data) => data?.message && toast.success(data.message),
  })
