import { createServer } from 'node:http'
import { ENV } from '@repo/service-core'
import { PORT, VERSION } from '@/constants/config'
import { ZodSmartCoercionPlugin } from '@orpc/zod'
import { OpenAPIHandler } from '@orpc/openapi/node'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { CORSPlugin, RequestHeadersPlugin, ResponseHeadersPlugin } from '@orpc/server/plugins'

import { router } from './router'
import './websocket' // Inicia o servidor WebSocket

const prefix = '/api'

const openAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: ENV.APP.WEB_URL,
      credentials: true,
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    }),
    new RequestHeadersPlugin(),
    new ResponseHeadersPlugin(),
    new ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      docsProvider: 'scalar',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      docsPath: '/docs',
      specGenerateOptions: {
        info: {
          title: 'oRCP - Documentation',
          version: VERSION,
        },
      },
    }),
  ],
})

const server = createServer(async (req, res) => {
  const { matched } = await openAPIHandler.handle(req, res, {
    prefix,
    context: {}, // Contexto vazio, sem autenticação
  })

  if (!matched) {
    res.statusCode = 404
    res.end('No procedure matched')
  }
})

const url = `http://localhost:${PORT}${prefix}`
server.listen(PORT, () => {
  console.log(`
───────────────────────────୨ৎ────────────────────────
𖤍 Server: ${url}
𖤍 Documentation: ${url}/docs
───────────────────────────୨ৎ────────────────────────
`)
})
