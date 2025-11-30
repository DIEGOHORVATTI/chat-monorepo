import type { ContactRequestSchema } from '@/core/infra/db/schema'
import type {
  ContactRequest,
  ContactRequestProps,
  ContactRequestStatus,
} from '@contacts/domain/entities'

export class ContactRequestMapper {
  static toDomain(raw: ContactRequestSchema): ContactRequest {
    const props: ContactRequestProps = {
      senderId: raw.senderId,
      receiverId: raw.receiverId,
      status: raw.status as ContactRequestStatus,
      message: raw.message,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }

    return {
      id: raw.id,
      ...props,
    }
  }

  static toPersistence(contactRequest: ContactRequest): ContactRequestSchema {
    return {
      id: contactRequest.id,
      senderId: contactRequest.senderId,
      receiverId: contactRequest.receiverId,
      status: contactRequest.status,
      message: contactRequest.message,
      createdAt: contactRequest.createdAt,
      updatedAt: contactRequest.updatedAt,
    }
  }
}
