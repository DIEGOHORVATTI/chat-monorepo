import type { User } from '@identity/domain/entities'
import type { PaginateResult } from '@/utils/paginate'

export type PaginatedUsers = PaginateResult<User>

export type UserRepository = {
  findAll: (page: number, limit: number) => Promise<PaginatedUsers>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
  updateLastLogin(id: string): Promise<User | null>
  markEmailAsVerified(id: string): Promise<void>
}
