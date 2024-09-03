import type { App } from '@/server/api/root'
import { treaty } from '@elysiajs/eden'

import { getBaseUrl } from '@/lib/utils'

export const api = treaty<App>(getBaseUrl()).api
