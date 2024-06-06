import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  // Server environment variables
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),

    // MongoDB connection string
    DATABASE_URL: z.string(),

    // Cloudinary
    CLD_NAME: z.string(),
    CLD_API_KEY: z.string(),
    CLD_API_SECRET: z.string(),

    // Email service (optional)
    API_KEY: z.string().optional(),
    EMAIL: z.string().email().optional(),
    SEND_EMAIL: z.string().optional(),
  },

  // Client environment variables
  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    CLD_NAME: process.env.CLD_NAME,
    CLD_API_KEY: process.env.CLD_API_KEY,
    CLD_API_SECRET: process.env.CLD_API_SECRET,
    API_KEY: process.env.API_KEY,
    EMAIL: process.env.EMAIL,
    SEND_EMAIL: process.env.SEND_EMAIL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
