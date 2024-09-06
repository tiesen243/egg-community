import Elysia, { type ElysiaConfig } from 'elysia'

import { db } from '@/server/db'
import { auth } from '@/server/auth'

const createContext = new Elysia()
  .derive(async () => {
    const { user, session } = await auth()
    return { db, user, session }
  })
  .as('plugin')

export const createElysia = <P extends string, S extends boolean>(c?: ElysiaConfig<P, S>) =>
  new Elysia({ ...c, normalize: true }).use(createContext)
