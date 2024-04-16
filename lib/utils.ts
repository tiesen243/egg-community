import { clsx, type ClassValue } from 'clsx'
import mime from 'mime'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fileToBase64 = async (file: File | undefined) => {
  if (!file) return
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
