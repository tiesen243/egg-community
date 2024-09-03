import { Elysia } from 'elysia'

import { postRoute } from '@/server/api/routes/post'
import { userRoute } from '@/server/api/routes/user'
import { commentRoute } from '@/server/api/routes/comment'

const app = new Elysia({ prefix: '/api' }).use(userRoute).use(postRoute).use(commentRoute).compile()

export const handler = app.handle

export type App = typeof app
