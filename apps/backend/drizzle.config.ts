import { ENV } from '@repo/service-core'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/core/infra/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE.POSTGRES_URL,
  },
  verbose: true,
  strict: true,
})
