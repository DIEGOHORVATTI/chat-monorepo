import type { ContactRepository } from '@contacts/domain/repositories'

import { paginate } from '@/utils/paginate'
import { eq, and, count } from 'drizzle-orm'
import { db } from '@/core/infra/db/drizzle'
import { contacts } from '@/core/infra/db/schema'

import { ContactMapper } from '../mappers'

export const makeContactRepository = (): ContactRepository => ({
  async findById(id) {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1)

    if (!contact) return null

    return ContactMapper.toDomain(contact)
  },

  async findByUserAndContact(userId, contactId) {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(and(eq(contacts.userId, userId), eq(contacts.contactId, contactId)))
      .limit(1)

    if (!contact) return null

    return ContactMapper.toDomain(contact)
  },

  async findAllByUserId(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit

    const [allContacts, [totalResult]] = await Promise.all([
      db.select().from(contacts).where(eq(contacts.userId, userId)).limit(limit).offset(offset),
      db.select({ count: count() }).from(contacts).where(eq(contacts.userId, userId)),
    ])

    return paginate(allContacts.map(ContactMapper.toDomain), totalResult?.count ?? 0, {
      page,
      limit,
    })
  },

  async save(contact) {
    const data = ContactMapper.toPersistence(contact)

    await db
      .insert(contacts)
      .values(data)
      .onConflictDoUpdate({
        target: contacts.id,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
  },

  async delete(id) {
    await db.delete(contacts).where(eq(contacts.id, id))
  },
})
