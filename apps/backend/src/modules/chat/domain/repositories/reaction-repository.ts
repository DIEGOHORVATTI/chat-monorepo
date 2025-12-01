import type { ReactionProps } from '../entities'

export interface ReactionRepository {
  findById(id: string): Promise<ReactionProps | null>
  findByMessageId(messageId: string): Promise<ReactionProps[]>
  findByMessageAndUser(messageId: string, userId: string): Promise<ReactionProps | null>
  save(reaction: ReactionProps): Promise<ReactionProps>
  delete(id: string): Promise<void>
}
