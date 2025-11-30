import * as animalRoutes from './modules/animals/presentation/routes/animal-routes'
import * as identityRoutes from './modules/identity/presentation/routes/identity-routes'
import * as mapRoutes from './modules/map/routes'

// Definir o objeto de rotas exportado
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
  animals: {
    list: animalRoutes.listAnimalsRoute,
    get: animalRoutes.getAnimalRoute,
    create: animalRoutes.createAnimalRoute,
    update: animalRoutes.updateAnimalRoute,
    delete: animalRoutes.deleteAnimalRoute,
  },
  map: {
    overview: mapRoutes.mapOverviewRoute,
  },
}
