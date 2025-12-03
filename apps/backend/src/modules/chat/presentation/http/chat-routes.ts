import { procedure, router } from '@orpc/server'
import { z } from 'zod'
import { chatService } from '../chat-service'

// Rota para buscar o histórico de mensagens
export const getMessagesRoute = procedure
  .input(z.void())
  .output(z.array(z.object({
    id: z.number(),
    username: z.string(),
    content: z.string(),
    createdAt: z.date(),
  })))
  .query(async () => {
    const messages = await chatService.getMessages()
    return messages
  })

// Rota para enviar uma nova mensagem (usada apenas para persistência inicial, o WS fará o broadcast)
export const sendMessageRoute = procedure
  .input(z.object({
    username: z.string().min(1),
    content: z.string().min(1),
  }))
  .output(z.object({
    id: z.number(),
    username: z.string(),
    content: z.string(),
    createdAt: z.date(),
  }))
  .mutation(async ({ input }) => {
    const newMessage = await chatService.saveMessage(input)
    return newMessage
  })

export const chatRoutes = router({
  getMessages: getMessagesRoute,
  sendMessage: sendMessageRoute,
})
