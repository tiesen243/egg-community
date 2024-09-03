import 'server-only'

import { cache } from 'react'

import { uncachedAuth } from '@/server/auth/uncached-auth'

export const auth = cache(uncachedAuth)
