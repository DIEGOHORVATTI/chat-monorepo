import * as contactsRoutes from './modules/contacts/presentation/http/contacts-routes'
import * as identityRoutes from './modules/identity/presentation/http/identity-routes'

export const router = {
  contacts: {
    addContact: contactsRoutes.addContactRoute,
    acceptContactRequest: contactsRoutes.acceptContactRequestRoute,
    rejectContactRequest: contactsRoutes.rejectContactRequestRoute,
    removeContact: contactsRoutes.removeContactRoute,
    updateContact: contactsRoutes.updateContactRoute,
    listContacts: contactsRoutes.listContactsRoute,
    listContactRequests: contactsRoutes.listContactRequestsRoute,
    getSentRequests: contactsRoutes.getSentRequestsRoute,
  },
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
