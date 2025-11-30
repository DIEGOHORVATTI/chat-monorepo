// Export schemas for reuse
export * from './schemas'

// Export routes for ORPC
import * as routes from './routes'

/**
 * @title Contracts - Horvatti Champ
 * @description This package defines the contracts for the Horvatti Champ application using ORPC (Open RPC).
 * It includes schemas and routes for identity management and animal management.
 * @see https://orpc.dev/docs/quick-start
 */
export const contracts = routes

/**
 * @title App Router - Horvatti Champ
 * @description This type represents the app router for the Horvatti Champ application.
 */
export type AppRouter = typeof contracts
