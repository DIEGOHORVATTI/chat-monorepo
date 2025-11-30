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
  },
}
