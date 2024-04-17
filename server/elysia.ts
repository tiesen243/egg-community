import { Elysia } from 'elysia'

import { postRoute } from '@/server/routes/post.route'
import { userRoute } from '@/server/routes/user.route'
import { commentRoute } from './routes/comment.route'

const app = new Elysia({ prefix: '/api' }).use(userRoute).use(postRoute).use(commentRoute).compile()

export const handler = app.handle

export type App = typeof app
