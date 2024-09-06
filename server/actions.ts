'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidate = async ({ tag, path }: { tag?: string; path?: string }) => {
  if (tag) return revalidateTag(tag)
  if (path) revalidatePath(path)
  return
}
