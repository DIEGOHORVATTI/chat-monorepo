import { makeUserRepository } from '@identity/infrastructure/repositories'
import {
  makeContactRepository,
  makeContactRequestRepository,
} from '@contacts/infrastructure/repositories'
import {
  makeAddContact,
  makeListContacts,
  makeRemoveContact,
  makeUpdateContact,
  makeListSentRequests,
  makeListContactRequests,
  makeAcceptContactRequest,
  makeRejectContactRequest,
} from '@contacts/application'

const userRepository = makeUserRepository()
const contactRepository = makeContactRepository()
const contactRequestRepository = makeContactRequestRepository()

// Contacts Use Cases
export const addContact = makeAddContact(
  contactRepository,
  contactRequestRepository,
  userRepository
)
export const acceptContactRequest = makeAcceptContactRequest(
  contactRepository,
  contactRequestRepository
)
export const rejectContactRequest = makeRejectContactRequest(contactRequestRepository)
export const removeContact = makeRemoveContact(contactRepository)
export const updateContact = makeUpdateContact(contactRepository)
export const listContacts = makeListContacts(contactRepository)
export const listContactRequests = makeListContactRequests(contactRequestRepository)
export const listSentRequests = makeListSentRequests(contactRequestRepository)
