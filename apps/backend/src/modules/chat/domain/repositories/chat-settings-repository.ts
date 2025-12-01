import type { ChatSettingsProps } from '../entities'

export interface ChatSettingsRepository {
  findByChatId(chatId: string): Promise<ChatSettingsProps | null>
  save(settings: ChatSettingsProps): Promise<ChatSettingsProps>
  update(settings: ChatSettingsProps): Promise<ChatSettingsProps>
}
