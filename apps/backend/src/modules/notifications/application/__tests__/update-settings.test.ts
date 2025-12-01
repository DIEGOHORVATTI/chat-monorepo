import type { NotificationSettingsProps } from '@/modules/notifications/domain/entities'
import type { NotificationSettingsRepository } from '@/modules/notifications/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeUpdateSettings } from '../update-settings'

describe('UpdateSettings Use Case', () => {
  let settingsRepository: NotificationSettingsRepository
  let updateSettings: ReturnType<typeof makeUpdateSettings>

  beforeEach(() => {
    settingsRepository = {
      findByUserId: async () =>
        ({
          userId: 'user-1',
          pushEnabled: true,
          emailEnabled: true,
          messageNotifications: true,
          mentionNotifications: true,
          callNotifications: true,
          reactionNotifications: true,
          muteAll: false,
          mutedChats: [],
        } as NotificationSettingsProps),
      save: async (settings) => settings as NotificationSettingsProps,
      update: async (settings) => settings as NotificationSettingsProps,
      muteChat: async () => undefined,
      unmuteChat: async () => undefined,
    } as NotificationSettingsRepository

    updateSettings = makeUpdateSettings(settingsRepository)
  })

  it('should update notification settings', async () => {
    const result = await updateSettings('user-1', {
      pushEnabled: false,
      muteAll: true,
    })

    expect(result.pushEnabled).toBe(false)
    expect(result.muteAll).toBe(true)
  })

  it('should create settings if not found', async () => {
    settingsRepository.findByUserId = async () => null

    const result = await updateSettings('user-2', {
      pushEnabled: false,
    })

    expect(result.userId).toBe('user-2')
    expect(result.pushEnabled).toBe(false)
  })
})
