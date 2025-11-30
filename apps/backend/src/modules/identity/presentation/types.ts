import type {
  RequestHeadersPluginContext,
  ResponseHeadersPluginContext,
} from '@orpc/server/plugins'

import type { EncodedJWTUser } from '../domain/entities'

type ORPContext = RequestHeadersPluginContext & ResponseHeadersPluginContext

export type UserRequestContext = ORPContext & {
  user?: EncodedJWTUser
}
