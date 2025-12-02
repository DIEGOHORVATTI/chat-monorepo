import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'

import { toast } from 'sonner'
import { contracts } from '@repo/contracts'
import { createORPCClient } from '@orpc/client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import { QueryCache, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: 'retry',
          onClick: () => {
            queryClient.invalidateQueries()
          },
        },
      })
    },
  }),
})

// Use OpenAPILink which is designed to work with OpenAPIHandler
const link = new OpenAPILink(contracts, {
  url: 'http://localhost:8000/api',
  headers: () => ({
    'Content-Type': 'application/json',
  }),
  fetch: (request, init) =>
    globalThis.fetch(request, {
      ...init,
      credentials: 'include',
    }),
})

// Cliente ORPC para chamadas imperativas
export const orpcClient: JsonifiedClient<ContractRouterClient<typeof contracts>> =
  createORPCClient(link)

// Cliente ORPC com React Query hooks
export const orpc = createORPCReactQueryUtils(orpcClient)
