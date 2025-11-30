import type { ContactSchema } from '@/core/infra/db/schema'
import type { Contact, ContactProps } from '@contacts/domain/entities'

export class ContactMapper {
  static toDomain(raw: ContactSchema): Contact {
    const props: ContactProps = {
      userId: raw.userId,
      contactId: raw.contactId,
      nickname: raw.nickname,
      favorite: raw.favorite,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }

    return {
      id: raw.id,
      ...props,
    }
  }

  static toPersistence(contact: Contact): ContactSchema {
    return {
      id: contact.id,
      userId: contact.userId,
      contactId: contact.contactId,
      nickname: contact.nickname,
      favorite: contact.favorite,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }
  }
}
