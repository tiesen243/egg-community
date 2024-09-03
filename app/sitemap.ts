import type { MetadataRoute } from 'next'

import { getBaseUrl } from '@/lib/utils'
import { db } from '@/server/db'

interface Route {
  url: string
  lastModified: string
}

const baseUrl = getBaseUrl()
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = ['', 'login', 'register', 'forgot-password', 'following', 'search'].map(
    (route) => ({
      url: `${baseUrl}/${route}`,
      lastModified: new Date().toISOString(),
    }),
  )

  const userRoute = await db.user
    .findMany({ select: { id: true, updatedAt: true } })
    .then((users) =>
      users.map((u) => ({
        url: `${baseUrl}/u/${u.id}`,
        lastModified: new Date(u.updatedAt).toISOString(),
      })),
    )

  const postRoute = await db.post
    .findMany({ select: { id: true, updatedAt: true } })
    .then((posts) =>
      posts.map((p) => ({
        url: `${baseUrl}/u/${p.id}`,
        lastModified: new Date(p.updatedAt).toISOString(),
      })),
    )

  let fetchedRoutes: Route[] = []
  try {
    fetchedRoutes = (await Promise.all([userRoute, postRoute])).flat()
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message)
  }
  return [...routesMap, ...fetchedRoutes]
}
