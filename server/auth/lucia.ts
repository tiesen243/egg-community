import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { User } from '@prisma/client'
import { Lucia, TimeSpan } from 'lucia'

import { env } from '@/env.mjs'
import { db } from '@/prisma'

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: User
  }
}

const adapter = new PrismaAdapter(db.session, db.user)

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    expires: false,
    attributes: { secure: env.NODE_ENV === 'production' },
  },
  getUserAttributes: (attr) => attr,
})
