import type { NotificationSettingsRepository } from '@/modules/notifications/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeMuteChat } from '../mute-chat'

describe('MuteChat Use Case', () => {
  let settingsRepository: NotificationSettingsRepository
  let muteChat: ReturnType<typeof makeMuteChat>

  beforeEach(() => {
    settingsRepository = {
      findByUserId: async () => null,
      save: async (settings) => settings,
      update: async (settings) => settings,
      muteChat: async () => undefined,
      unmuteChat: async () => undefined,
    } as NotificationSettingsRepository

    muteChat = makeMuteChat(settingsRepository)
  })

  it('should mute chat successfully', async () => {
    await expect(muteChat('user-1', 'chat-1')).resolves.toBeUndefined()
  })
})
