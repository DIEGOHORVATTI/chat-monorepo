import { db } from '@/core/infra/db'
import { messages, NewMessage } from './infra/database/schema'
import { eq } from 'drizzle-orm'

export class ChatService {
  async getMessages() {
    return db.select().from(messages).orderBy(messages.createdAt)
  }

  async saveMessage(message: NewMessage) {
    const [newMessage] = await db.insert(messages).values(message).returning()
    return newMessage
  }
}

export const chatService = new ChatService()
