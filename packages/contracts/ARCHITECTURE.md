# Contracts Package

Pacote de contratos da aplicação de chat, construído com arquitetura DDD (Domain-Driven Design) e aplicando o princípio de inversão de dependência (DIP).

## 📁 Estrutura

```
src/
├── modules/                    # Módulos de domínio
│   ├── identity/              # Autenticação e gerenciamento de usuários
│   │   ├── types.ts           # Interfaces TypeScript puras
│   │   ├── identity.schema.ts # Implementação Zod
│   │   ├── identity.contract.ts # Contratos ORPC
│   │   └── index.ts           # Exports do módulo
│   │
│   ├── chat/                  # Sistema de mensagens
│   │   ├── types.ts
│   │   ├── chat.schema.ts
│   │   ├── chat.contract.ts
│   │   └── index.ts
│   │
│   ├── calls/                 # Chamadas de vídeo/áudio
│   │   ├── types.ts
│   │   ├── calls.schema.ts
│   │   ├── calls.contract.ts
│   │   └── index.ts
│   │
│   ├── websocket/             # Eventos WebSocket de chat
│   │   ├── types.ts
│   │   ├── websocket.schema.ts
│   │   ├── websocket.contract.ts
│   │   └── index.ts
│   │
│   ├── websocket-calls/       # Eventos WebSocket de chamadas
│   │   ├── websocket-calls.schema.ts
│   │
│   └── index.ts # Export principal
├── shared/                    # Utilitários compartilhados
│   ├── types.ts              # Tipos base (Meta, Pagination, etc)
│   ├── base.schema.ts        # Schemas base
│   └── index.ts
```

## 🎯 Princípios de Arquitetura

### 1. **Inversão de Dependência (DIP)**

Cada módulo segue a estrutura:

```typescript
// types.ts - Interfaces puras (sem dependências)
export interface User {
  id: string
  email: string
  name: string
}

// *.schema.ts - Implementação Zod usando 'satisfies'
export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
}) satisfies z.ZodType<User>
```

**Vantagens:**

- ✅ Fácil migração de Zod para Yup/Joi/outro
- ✅ Tipos garantidos em tempo de compilação
- ✅ Interfaces puras servem como contrato
- ✅ Desacoplamento de bibliotecas de validação

### 2. **Co-localização por Domínio**

Tudo relacionado a um domínio fica junto:

```
chat/
  ├── types.ts       # Tipos do domínio
  ├── *.schema.ts    # Validação
  └── *.contract.ts  # APIs
```

### 3. **Separação de Responsabilidades**

- **types.ts**: Contratos de interface (sem libs)
- **\*.schema.ts**: Validação de runtime (Zod)
- **\*.contract.ts**: Definição de rotas (ORPC)

## 📦 Como Usar

### Importar um módulo completo:

```typescript
import { User, userSchema, identity } from '@/contracts'
// ou
import { User, userSchema, identity } from '@/contracts/modules/identity'
```

### Importar apenas tipos (sem Zod):

```typescript
import type { User, Login } from '@/contracts/modules/identity/types'
```

### Importar apenas schemas:

```typescript
import { userSchema, loginSchema } from '@/contracts/modules/identity/identity.schema'
```

## 🔄 Migração de Zod

Se um dia quiser trocar Zod por outra biblioteca:

1. **types.ts** permanece intacto ✅
2. Apenas **\*.schema.ts** precisa ser reescrito
3. Use `satisfies` para garantir compatibilidade com tipos

Exemplo de migração para Yup:

```typescript
// types.ts - NÃO MUDA
export interface User {
  id: string
  email: string
}

// identity.schema.ts - ANTES (Zod)
export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
}) satisfies z.ZodType<User>

// identity.schema.ts - DEPOIS (Yup)
export const userSchema = yup.object({
  id: yup.string().required(),
  email: yup.string().email().required(),
}) satisfies yup.Schema<User>
```

## 🔗 ORPC Contracts

Contratos de API definidos com ORPC:

```typescript
export const identity = oc.prefix('/identity').router({
  login: prefix
    .route({ method: 'POST', path: '/login' })
    .input(loginSchema)
    .output(userResponseSchema),
})
```

## 📝 Convenções

1. **Arquivos types.ts**: Apenas interfaces/types TypeScript puros
2. **Arquivos \*.schema.ts**: Implementações Zod com `satisfies`
3. **Arquivos \*.contract.ts**: Definições ORPC
4. **Nomes de enum**: PascalCase (ex: `MessageType`, `CallStatus`)
5. **Schemas**: camelCase + "Schema" (ex: `userSchema`, `messageSchema`)

## 🚀 Próximos Passos

Para adicionar um novo módulo:

1. Criar diretório em `src/modules/nome-modulo/`
2. Criar `types.ts` com interfaces puras
3. Criar `nome-modulo.schema.ts` com schemas Zod
4. Criar `nome-modulo.contract.ts` com rotas ORPC
5. Criar `index.ts` exportando tudo
6. Adicionar exports em `src/index.ts`

## 🎓 Recursos

- [ORPC Documentation](https://orpc.dev/)
- [Zod Documentation](https://zod.dev/)
- [DIP Explanation](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
