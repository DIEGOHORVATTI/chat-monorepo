import { identity, chat, calls, websocket } from './modules'

export const contracts = {
  identity,
  chat,
  calls,
  websocket,
}

/**
 * @title App Router - Chat Monorepo
 * @description Type-safe router for the entire application
 */
export type AppRouter = typeof contracts
