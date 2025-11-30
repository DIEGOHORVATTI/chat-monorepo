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

import { makeGetAnimal } from './modules/animals/application/get-animal'
import { makeListAnimals } from './modules/animals/application/list-animals'
import { makeCreateAnimal } from './modules/animals/application/create-animal'
import { makeDeleteAnimal } from './modules/animals/application/delete-animal'
import { makeUpdateAnimal } from './modules/animals/application/update-animal'
import { makeAnimalRepository } from './modules/animals/infrastructure/animal-repository'

// Animal Module Dependencies

// =================================================================
// INSTANTIATE REPOSITORIES AND SERVICES
// =================================================================
const userRepository = makeUserRepository()
const animalRepository = makeAnimalRepository()
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

// Animal Use Cases
export const createAnimal = makeCreateAnimal(animalRepository)
export const deleteAnimal = makeDeleteAnimal(animalRepository)
export const getAnimal = makeGetAnimal(animalRepository)
export const updateAnimal = makeUpdateAnimal(animalRepository)
export const listAnimals = makeListAnimals(animalRepository)
