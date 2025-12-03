import { createClient } from '@orpc/client'
import { router } from '../../../apps/backend/src/router' // Importando o router do backend para tipagem
import { QueryClient } from '@tanstack/react-query'

export const orpcClient = createClient<typeof router>({
  url: '/api',
})

export const queryClient = new QueryClient()
