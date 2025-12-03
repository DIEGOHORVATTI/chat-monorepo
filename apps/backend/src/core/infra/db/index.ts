import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { ENV } from '@repo/service-core'
import * as schema from '@/modules/chat/infra/database/schema'

const client = postgres(ENV.DATABASE.POSTGRES_URL, {
  max: 1,
})

export const db = drizzle(client, { schema })
