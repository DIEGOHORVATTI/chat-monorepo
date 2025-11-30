import { ORPCError } from '@orpc/server'

// usado quando a requisição não pode ser processada devido a dados inválidos
// statusCode: 400
export const badRequest = (message: string) => new ORPCError('BAD_REQUEST', { message })

// usado quando o usuário não está autenticado
// statusCode: 401
export const unauthorized = (message: string) => new ORPCError('UNAUTHORIZED', { message })

// usado quando o usuário não tem permissão para acessar um recurso
// statusCode: 403
export const forbidden = (message: string) => new ORPCError('FORBIDDEN', { message })

// usado quando o recurso solicitado não foi encontrado
// statusCode: 404
export const notFound = (message: string) => new ORPCError('NOT_FOUND', { message })

// usado quando já existe um recurso com os mesmos dados
// statusCode: 409
export const conflict = (message: string) => new ORPCError('CONFLICT', { message })

// usado quando ocorreu um erro inesperado no servidor
// statusCode: 500
export const internal = (message: string) => new ORPCError('INTERNAL_SERVER_ERROR', { message })
