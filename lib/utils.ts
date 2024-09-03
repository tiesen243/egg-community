import { clsx, type ClassValue } from 'clsx'
import mime from 'mime'
import { twMerge } from 'tailwind-merge'

import { env } from '@/env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return `http://localhost:3000`
}

export const fileToBase64 = async (file: File | undefined) => {
  if (!file) return ''
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const base64File = Buffer.from(buffer).toString('base64')
  const fileMimeType = mime.getType(file.name)
  return `data:${fileMimeType};base64,${base64File}`
}

export const previewFile = (
  file: File | undefined,
  setPreview: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => setPreview(reader.result as string)
  reader.readAsDataURL(file)
}
