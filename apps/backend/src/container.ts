import { jwtService } from '@repo/service-core'
import { makeEmailNotificationService } from '@identity/infrastructure/services'
import {
  makeUserRepository,
  makeEmailVerificationRepository,
} from '@identity/infrastructure/repositories'
// Identity Module Dependencies
import {
  makeLogin,
  makeRegister,
  makeListUsers,
  makeVerifyEmail,
  makeResendVerification,
} from '@identity/application'

// Animal Module Dependencies

// =================================================================
// INSTANTIATE REPOSITORIES AND SERVICES
// =================================================================
const userRepository = makeUserRepository()
const emailVerificationRepository = makeEmailVerificationRepository()
const emailNotificationService = makeEmailNotificationService()

// =================================================================
// EXPORT USE CASES
// =================================================================

// Identity Use Cases
export const login = makeLogin(userRepository, jwtService)
export const register = makeRegister(
  userRepository,
  emailVerificationRepository,
  emailNotificationService
)
export const verifyEmail = makeVerifyEmail(userRepository, emailVerificationRepository)
export const resendVerification = makeResendVerification(
  userRepository,
  emailVerificationRepository,
  emailNotificationService
)
export const listUsers = makeListUsers(userRepository)
