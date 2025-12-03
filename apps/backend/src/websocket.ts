import { Server } from 'ws'
import { chatService } from './modules/chat/chat-service'
import { Message } from './modules/chat/infra/database/schema'

const wss = new Server({ port: 8080 }) // Porta do WebSocket

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado ao WebSocket')

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString())
      if (data.type === 'NEW_MESSAGE') {
        const { username, content } = data.payload
        const newMessage: Message = await chatService.saveMessage({ username, content })

        // Broadcast da nova mensagem para todos os clientes conectados
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type: 'MESSAGE_RECEIVED', payload: newMessage }))
          }
        })
      }
    } catch (error) {
      console.error('Erro ao processar mensagem do WebSocket:', error)
    }
  })

  ws.on('close', () => {
    console.log('Cliente desconectado do WebSocket')
  })
})

console.log('Servidor WebSocket iniciado na porta 8080')

export { wss }
