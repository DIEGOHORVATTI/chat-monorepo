import { useState } from 'react'
import { Index } from './pages/Index'
import { ChatRoom } from './components/chat/ChatRoom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/orpc-client'

function App() {
  const [username, setUsername] = useState<string | null>(null)

  if (!username) {
    return <Index onLogin={setUsername} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ChatRoom username={username} />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
