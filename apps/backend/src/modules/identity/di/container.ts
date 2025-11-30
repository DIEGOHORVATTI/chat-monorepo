import { jwtService } from '@repo/service-core'
import { makeEmailNotificationService } from '@identity/infrastructure/services'
import {
  makeUserRepository,
  makeEmailVerificationRepository,
} from '@identity/infrastructure/repositories'
import {
  makeGetMe,
  makeLogin,
  makeRegister,
  makeBlockUser,
  makeListUsers,
  makeGetUserById,
  makeUnblockUser,
  makeVerifyEmail,
  makeUpdateProfile,
  makeChangePassword,
  makeResendVerification,
} from '@identity/application'

const userRepository = makeUserRepository()
const emailVerificationRepository = makeEmailVerificationRepository()
const emailNotificationService = makeEmailNotificationService()

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
export const getMe = makeGetMe(userRepository)
export const getUserById = makeGetUserById(userRepository)
export const updateProfile = makeUpdateProfile(userRepository)
export const changePassword = makeChangePassword(userRepository)
export const blockUser = makeBlockUser(userRepository)
export const unblockUser = makeUnblockUser(userRepository)
