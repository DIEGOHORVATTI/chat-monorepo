import type { NotificationSettingsProps } from '../entities'

export interface NotificationSettingsRepository {
  findByUserId(userId: string): Promise<NotificationSettingsProps | null>
  save(settings: NotificationSettingsProps): Promise<NotificationSettingsProps>
  update(settings: NotificationSettingsProps): Promise<NotificationSettingsProps>
  muteChat(userId: string, chatId: string): Promise<void>
  unmuteChat(userId: string, chatId: string): Promise<void>
}
