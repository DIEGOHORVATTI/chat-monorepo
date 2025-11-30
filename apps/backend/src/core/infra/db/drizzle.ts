import postgres from 'postgres'
import { ENV } from '@repo/service-core'
import { drizzle } from 'drizzle-orm/postgres-js'

import * as schema from './schema'

const client = postgres(ENV.DATABASE.POSTGRES_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema })

export type Database = typeof db

// Testa a conexão
void client`SELECT 1`
  .then(() => {
    console.log('✅ Drizzle conectado com sucesso ao banco de dados \n')
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar o Drizzle ao banco de dados:', error)
    process.exit(1)
  })
