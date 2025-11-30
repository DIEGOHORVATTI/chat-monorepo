import * as identityRoutes from './modules/identity/presentation/http/identity-routes'

export const router = {
  identity: {
    login: identityRoutes.loginRoute,
    register: identityRoutes.registerRoute,
    verifyEmail: identityRoutes.verifyEmailRoute,
    resendVerification: identityRoutes.resendVerificationRoute,
    logout: identityRoutes.logoutRoute,
    me: identityRoutes.meRoute,
    listUsers: identityRoutes.listUsersRoute,
    getUserById: identityRoutes.getUserByIdRoute,
    updateProfile: identityRoutes.updateProfileRoute,
    changePassword: identityRoutes.changePasswordRoute,
    blockUser: identityRoutes.blockUserRoute,
    unblockUser: identityRoutes.unblockUserRoute,
  },
}
