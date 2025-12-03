import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpcClient } from '@/lib/orpc-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: number
  username: string
  content: string
  createdAt: string
}

interface ChatRoomProps {
  username: string
}

export const ChatRoom = ({ username }: ChatRoomProps) => {
  const [message, setMessage] = useState('')
  const queryClient = useQueryClient()
  const ws = useRef<WebSocket | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. Query para buscar o histórico de mensagens
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['chatMessages'],
    queryFn: () => orpcClient.chat.getMessages.query(),
    staleTime: Infinity,
  })

  // 2. Conexão WebSocket
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080')
    ws.current = websocket

    websocket.onopen = () => console.log('Conectado ao WebSocket')
    websocket.onclose = () => console.log('Desconectado do WebSocket')

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'MESSAGE_RECEIVED') {
        queryClient.setQueryData<Message[]>(['chatMessages'], (oldData) => {
          const newData = oldData ? [...oldData, data.payload] : [data.payload]
          return newData
        })
      }
    }

    return () => {
      websocket.close()
    }
  }, [queryClient])

  // 3. Mutation para enviar a mensagem (apenas para persistência)
  const sendMessageMutation = useMutation({
    mutationFn: (newMessage: { username: string; content: string }) =>
      orpcClient.chat.sendMessage.mutate(newMessage),
    onSuccess: () => {
      setMessage('')
    },
    onError: (error) => {
      console.error('Erro ao enviar mensagem:', error)
    },
  })

  // 4. Envio da mensagem
  const handleSendMessage = useCallback(() => {
    if (message.trim() && !sendMessageMutation.isLoading) {
      sendMessageMutation.mutate({ username, content: message.trim() })
    }
  }, [message, username, sendMessageMutation])

  // 5. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="flex h-full w-full max-w-2xl flex-col">
        <CardHeader>
          <CardTitle>Sala de Chat Global</CardTitle>
          <p className="text-sm text-muted-foreground">Logado como: <strong>{username}</strong></p>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  msg.username === username ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    msg.username === username
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-xs font-bold mb-1">
                    {msg.username === username ? 'Você' : msg.username}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-right mt-1 opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="flex w-full space-x-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={sendMessageMutation.isLoading}
            />
            <Button onClick={handleSendMessage} disabled={!message.trim() || sendMessageMutation.isLoading}>
              Enviar
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
