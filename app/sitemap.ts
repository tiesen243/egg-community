import { getBaseUrl } from '@/lib/site'
import { db } from '@/prisma'
import type { MetadataRoute } from 'next'

interface Route {
  url: string
  lastModified: string
}

const baseUrl = getBaseUrl()
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = [
    '',
    'auth/login',
    'auth/register',
    'auth/forgot-password',
    'following',
    'search',
  ].map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date().toISOString(),
  }))

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
    throw JSON.stringify(error, null, 2)
  }
  return [...routesMap, ...fetchedRoutes]
}
