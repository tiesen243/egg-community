import 'server-only'

import { v2 as cloudinary } from 'cloudinary'

import { env } from '@/env'

cloudinary.config({
  cloud_name: env.CLD_NAME,
  api_key: env.CLD_API_KEY,
  api_secret: env.CLD_API_SECRET,
})

export const saveFile = async (base64: string, folder: 'avatar' | 'post') => {
  try {
    const result = await cloudinary.uploader.upload(base64, { folder: `egg-community/${folder}` })
    return { url: result.url }
  } catch (error) {
    if (error instanceof Error) return { error: error.message, url: '' }
  }
}

export const deleteFile = async (url: string) => {
  const publicId = url.split('/').slice(-3).join('/').split('.')[0]
  if (!publicId) return
  await cloudinary.uploader.destroy(publicId)
}
