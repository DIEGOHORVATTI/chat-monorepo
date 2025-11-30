import type { ContactRequestStatus } from '@contacts/domain/entities'
import type { ContactRequestRepository } from '@contacts/domain/repositories'

import { paginate } from '@/utils/paginate'
import { db } from '@/core/infra/db/drizzle'
import { eq, or, and, count } from 'drizzle-orm'
import { contactRequests } from '@/core/infra/db/schema'

import { ContactRequestMapper } from '../mappers'

export const makeContactRequestRepository = (): ContactRequestRepository => ({
  async findById(id) {
    const [request] = await db
      .select()
      .from(contactRequests)
      .where(eq(contactRequests.id, id))
      .limit(1)

    if (!request) return null

    return ContactRequestMapper.toDomain(request)
  },

  async findByUsers(senderId, receiverId) {
    const [request] = await db
      .select()
      .from(contactRequests)
      .where(
        or(
          and(eq(contactRequests.senderId, senderId), eq(contactRequests.receiverId, receiverId)),
          and(eq(contactRequests.senderId, receiverId), eq(contactRequests.receiverId, senderId))
        )
      )
      .limit(1)

    if (!request) return null

    return ContactRequestMapper.toDomain(request)
  },

  async findPendingByReceiver(receiverId, page = 1, limit = 20) {
    const offset = (page - 1) * limit

    const [requests, [totalResult]] = await Promise.all([
      db
        .select()
        .from(contactRequests)
        .where(
          and(eq(contactRequests.receiverId, receiverId), eq(contactRequests.status, 'pending'))
        )
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(contactRequests)
        .where(
          and(eq(contactRequests.receiverId, receiverId), eq(contactRequests.status, 'pending'))
        ),
    ])

    return paginate(requests.map(ContactRequestMapper.toDomain), totalResult?.count ?? 0, {
      page,
      limit,
    })
  },

  async findBySender(senderId, page = 1, limit = 20) {
    const offset = (page - 1) * limit

    const [requests, [totalResult]] = await Promise.all([
      db
        .select()
        .from(contactRequests)
        .where(eq(contactRequests.senderId, senderId))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(contactRequests)
        .where(eq(contactRequests.senderId, senderId)),
    ])

    return paginate(requests.map(ContactRequestMapper.toDomain), totalResult?.count ?? 0, {
      page,
      limit,
    })
  },

  async save(contactRequest) {
    const data = ContactRequestMapper.toPersistence(contactRequest)

    await db
      .insert(contactRequests)
      .values(data)
      .onConflictDoUpdate({
        target: contactRequests.id,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
  },

  async updateStatus(id, status: ContactRequestStatus) {
    await db
      .update(contactRequests)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(contactRequests.id, id))
  },
})
