import {
  identity,
  contacts,
  chat,
  calls,
  websocket,
  notifications,
  media,
  moderation,
} from './modules'

export * from './modules'

export const contracts = {
  identity,
  contacts,
  chat,
  calls,
  websocket,
  notifications,
  media,
  moderation,
}

/**
 * @title App Router - Chat Monorepo
 * @description Type-safe router for the entire application
 */
export type AppRouter = typeof contracts
