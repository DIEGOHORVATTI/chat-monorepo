import type { User } from '@identity/domain/entities'
import type { PaginateResult } from '@/utils/paginate'

export type PaginatedUsers = PaginateResult<User>

export type PrivacySettings = {
  profilePhoto: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
  lastSeen: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
  status: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
  readReceipts: boolean
  allowMessagesFrom: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
  allowCallsFrom: 'everyone' | 'contacts' | 'contacts_except' | 'nobody'
  blockedUsers: string[]
}

export type UserStatus = 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE'

export type UserRepository = {
  findAll: (page: number, limit: number) => Promise<PaginatedUsers>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
  updateLastLogin(id: string): Promise<User | null>
  markEmailAsVerified(id: string): Promise<void>
  blockUser(userId: string, blockedUserId: string): Promise<void>
  unblockUser(userId: string, blockedUserId: string): Promise<void>
  isUserBlocked(userId: string, blockedUserId: string): Promise<boolean>
  updatePrivacy(userId: string, privacy: Partial<PrivacySettings>): Promise<User>
  updateStatus(userId: string, status: UserStatus): Promise<User>
  setCustomStatus(
    userId: string,
    customStatus: string,
    emoji?: string,
    expiresAt?: Date
  ): Promise<User>
  clearCustomStatus(userId: string): Promise<void>
  getOnlineUsers(): Promise<User[]>
  deleteUser(userId: string): Promise<void>
}
