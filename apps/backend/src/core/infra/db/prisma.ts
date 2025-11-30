import { ENV } from '@repo/service-core'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: ENV.DATABASE?.POSTGRES_URL,
    },
  },
})

void prisma
  .$connect()
  .then(() => {
    console.log('✅ Prisma conectado com sucesso ao banco de dados \n')
  })
  .catch(() => {
    console.error('❌ Erro ao conectar o Prisma ao banco de dados \n')
    process.exit(1) // Encerra o processo com código de erro
  })
