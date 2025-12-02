import type { QueryClientProviderProps } from '@tanstack/react-query'

import { QueryClientProvider } from '@tanstack/react-query'

export default function TanstackQueryProvider({ children, client }: QueryClientProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
