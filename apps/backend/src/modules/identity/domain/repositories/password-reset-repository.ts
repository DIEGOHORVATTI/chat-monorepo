export type PasswordReset = {
  id: string
  userId: string
  token: string
  expiresAt: Date
  isUsed: boolean
  createdAt: Date
  updatedAt: Date
}

export type PasswordResetRepository = {
  save(passwordReset: PasswordReset): Promise<void>
  findByToken(token: string): Promise<PasswordReset | null>
  markAsUsed(token: string): Promise<void>
  deleteExpired(): Promise<void>
}
