import Elysia from 'elysia'

import { db } from '@/prisma'
import { uncachedAuth } from '@/server/auth'

export const context = new Elysia({ name: 'App.Context' }).derive({ as: 'global' }, async () => {
  const { session, user } = await uncachedAuth()
  return { session, user, db }
})
