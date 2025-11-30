import { jwtService, refreshTokenService } from '@repo/service-core'
import { makeEmailNotificationService } from '@identity/infrastructure/services'
import {
  makeUserRepository,
  makePasswordResetRepository,
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
  makeUpdateStatus,
  makeRefreshToken,
  makeUpdateProfile,
  makeUpdatePrivacy,
  makeDeleteAccount,
  makeResetPassword,
  makeChangePassword,
  makeGetOnlineUsers,
  makeExportUserData,
  makeForgotPassword,
  makeSetCustomStatus,
  makeClearCustomStatus,
  makeResendVerification,
} from '@identity/application'

const userRepository = makeUserRepository()
const emailVerificationRepository = makeEmailVerificationRepository()
const passwordResetRepository = makePasswordResetRepository()
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
export const updatePrivacy = makeUpdatePrivacy(userRepository)
export const updateStatus = makeUpdateStatus(userRepository)
export const setCustomStatus = makeSetCustomStatus(userRepository)
export const clearCustomStatus = makeClearCustomStatus(userRepository)
export const getOnlineUsers = makeGetOnlineUsers(userRepository)
export const exportUserData = makeExportUserData(userRepository)
export const deleteAccount = makeDeleteAccount(userRepository)
export const forgotPassword = makeForgotPassword(
  userRepository,
  passwordResetRepository,
  emailNotificationService
)
export const resetPassword = makeResetPassword(userRepository, passwordResetRepository)
export const refreshToken = makeRefreshToken(userRepository, jwtService, refreshTokenService)
