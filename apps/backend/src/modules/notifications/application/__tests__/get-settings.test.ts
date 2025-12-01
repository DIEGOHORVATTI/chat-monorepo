import type { NotificationSettingsProps } from '@/modules/notifications/domain/entities'
import type { NotificationSettingsRepository } from '@/modules/notifications/domain/repositories'

import { it, expect, describe, beforeEach } from 'vitest'

import { makeGetSettings } from '../get-settings'

describe('GetSettings Use Case', () => {
  let settingsRepository: NotificationSettingsRepository
  let getSettings: ReturnType<typeof makeGetSettings>

  beforeEach(() => {
    settingsRepository = {
      findByUserId: async (userId) =>
        userId === 'user-1'
          ? ({
              userId: 'user-1',
              pushEnabled: true,
              emailEnabled: true,
              messageNotifications: true,
              mentionNotifications: true,
              callNotifications: true,
              reactionNotifications: true,
              muteAll: false,
              mutedChats: [],
            } as NotificationSettingsProps)
          : null,
      save: async (settings) => settings as NotificationSettingsProps,
      update: async (settings) => settings as NotificationSettingsProps,
      muteChat: async () => undefined,
      unmuteChat: async () => undefined,
    } as NotificationSettingsRepository

    getSettings = makeGetSettings(settingsRepository)
  })

  it('should get notification settings', async () => {
    const result = await getSettings('user-1')

    expect(result.userId).toBe('user-1')
    expect(result.pushEnabled).toBe(true)
    expect(result.muteAll).toBe(false)
  })

  it('should create default settings if not found', async () => {
    settingsRepository.findByUserId = async () => null

    const result = await getSettings('user-2')

    expect(result.userId).toBe('user-2')
    expect(result.pushEnabled).toBe(true)
    expect(result.mutedChats).toEqual([])
  })
})
