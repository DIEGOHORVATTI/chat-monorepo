# GitHub Copilot Instructions - Backend (Apps/Backend)

Você é um assistente especializado no desenvolvimento do backend do sistema de comunicação em tempo real usando Domain-Driven Design (DDD) e Clean Architecture.

## 🎯 Contexto do Projeto

Este é o backend TypeScript que implementa:

- **Architecture**: Domain-Driven Design (DDD) + Clean Architecture
- **Framework**: ORPC com contratos type-safe
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: JWT + Refresh Tokens
- **Email**: Nodemailer + React Email templates
- **Testing**: Vitest para unit e integration tests

## 📐 Arquitetura em Camadas

### Estrutura de Módulos

```
src/modules/
  └── nome-modulo/
      ├── domain/                    # Camada de Domínio (núcleo)
      │   ├── entities/              # Entidades de domínio
      │   │   ├── entity-name.ts
      │   │   └── index.ts
      │   ├── repositories/          # Interfaces de repositórios
      │   │   ├── entity-repository.ts
      │   │   └── index.ts
      │   └── services/              # Interfaces de serviços de domínio
      │       ├── service-sender.ts
      │       └── index.ts
      ├── application/               # Camada de Aplicação (casos de uso)
      │   ├── __tests__/             # Testes unitários dos casos de uso
      │   │   ├── use-case-name.test.ts
      │   │   └── another-use-case.test.ts
      │   ├── use-case-name.ts
      │   └── index.ts
      ├── infrastructure/            # Camada de Infraestrutura
      │   ├── repositories/          # Implementação de repositórios
      │   │   ├── entity-repository.ts
      │   │   └── index.ts
      │   ├── mappers/               # Mapeamento DB <-> Domain
      │   │   ├── entity-mapper.ts
      │   │   └── index.ts
      │   └── services/              # Implementação de serviços
      │       ├── smtp-service-sender.ts
      │       └── index.ts
      ├── presentation/              # Camada de Apresentação
      │   └── http/                  # Handlers HTTP (REST/ORPC)
      │       ├── module-routes.ts
      │       └── module-routes.test.ts
      └── di/                        # Dependency Injection
          └── container.ts           # Container de dependências
```

## 🔧 Regras por Camada

### 1. Domain Layer (Camada de Domínio)

**Responsabilidade**: Lógica de negócio pura, regras de domínio, entidades

**Regras:**

- ✅ Apenas TypeScript puro - SEM dependências externas
- ✅ Sem imports de frameworks (ORPC, Drizzle, etc)
- ✅ Sem lógica de infraestrutura (DB, API, Email)
- ✅ Define interfaces, NÃO implementações
- ✅ Entidades devem ser imutáveis (readonly properties quando possível)
- ✅ Factory functions para criar entidades

**Exemplo - Entity:**

```typescript
// domain/entities/user.ts
import { randomUUID } from 'crypto'

export enum PermissionType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  id?: string
  email: string
  name: string
  password: string
  permissions: PermissionType[]
  isActive: boolean
  isEmailVerified: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface User extends Required<UserProps> {}

export const createUser = (props: UserProps): User => ({
  id: props.id ?? randomUUID(),
  email: props.email.toLowerCase(),
  name: props.name.trim(),
  password: props.password,
  permissions: props.permissions,
  isActive: props.isActive,
  isEmailVerified: props.isEmailVerified,
  lastLoginAt: props.lastLoginAt,
  createdAt: props.createdAt,
  updatedAt: props.updatedAt,
})
```

**Exemplo - Repository Interface:**

```typescript
// domain/repositories/user-repository.ts
import type { User } from '../entities'
import type { Meta } from '@repo/contracts'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(page: number, limit: number): Promise<{ data: User[]; meta: Meta }>
  save(user: User): Promise<void>
  updateLastLogin(userId: string): Promise<User | null>
  markEmailAsVerified(userId: string): Promise<void>
}
```

**Exemplo - Service Interface:**

```typescript
// domain/services/email-service.ts
export interface EmailNotificationService {
  sendVerificationEmail(data: { email: string; name: string; code: string }): Promise<void>
}
```

### 2. Application Layer (Camada de Aplicação)

**Responsabilidade**: Casos de uso, orquestração de domínio

**Regras:**

- ✅ Implementa casos de uso específicos da aplicação
- ✅ Orquestra entidades e repositórios do domínio
- ✅ Usa factory pattern para injeção de dependências
- ✅ SEMPRE tem testes unitários correspondentes (`.test.ts`)
- ✅ Valida regras de negócio usando entidades de domínio
- ✅ Retorna DTOs ou entidades de domínio
- ❌ NÃO deve conhecer detalhes de infraestrutura (DB, HTTP, etc)

**Padrão de Factory Function:**

```typescript
// application/login.ts
import type { JwtService } from '@repo/service-core'
import type { UserRepository } from '@identity/domain/repositories'
import { compare } from 'bcrypt'
import { unauthorized } from '@repo/service-core'

type LoginData = {
  email: string
  password: string
}

export const makeLogin =
  (userRepository: UserRepository, jwtService: JwtService) =>
  async ({ email, password }: LoginData): Promise<string> => {
    const user = await userRepository.findByEmail(email)

    if (!user || !(await compare(password, user.password))) {
      throw unauthorized('Invalid email or password')
    }

    const updatedUser = await userRepository.updateLastLogin(user.id)
    if (!updatedUser) {
      throw unauthorized('Failed to update last login')
    }

    const token = await jwtService.sign({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      permissions: updatedUser.permissions,
    })

    return token
  }
```

**Testes Unitários:**

```typescript
// application/login.test.ts
import { it, vi, expect, describe, beforeEach } from 'vitest'
import { makeLogin } from './login'

describe('Login Use Case', () => {
  let mockUserRepository: UserRepository
  let mockJwtService: JwtService
  let login: ReturnType<typeof makeLogin>

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      updateLastLogin: vi.fn(),
      // ... outros métodos mockados
    }
    mockJwtService = {
      sign: vi.fn(),
      verify: vi.fn(),
    }
    login = makeLogin(mockUserRepository, mockJwtService)
  })

  it('should login successfully with valid credentials', async () => {
    // Arrange
    const loginData = { email: 'test@example.com', password: 'password123' }
    const user = createUser({
      /* ... */
    })

    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(user)
    vi.spyOn(mockUserRepository, 'updateLastLogin').mockResolvedValue(user)
    vi.spyOn(mockJwtService, 'sign').mockResolvedValue('mock-token')

    // Act
    const token = await login(loginData)

    // Assert
    expect(token).toBe('mock-token')
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email)
    expect(mockJwtService.sign).toHaveBeenCalled()
  })

  it('should throw error with invalid credentials', async () => {
    // Arrange
    vi.spyOn(mockUserRepository, 'findByEmail').mockResolvedValue(null)

    // Act & Assert
    await expect(login({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(
      'Invalid email or password'
    )
  })
})
```

### 3. Infrastructure Layer (Camada de Infraestrutura)

**Responsabilidade**: Implementações concretas, integrações externas

**Regras:**

- ✅ Implementa interfaces definidas no domínio
- ✅ Contém lógica de banco de dados (Drizzle)
- ✅ Contém integração com serviços externos (Email, Storage, etc)
- ✅ Usa mappers para converter DB models <-> Domain entities
- ✅ Lida com transações e persistência

**Exemplo - Repository Implementation:**

```typescript
// infrastructure/repositories/user-repository.ts
import type { UserRepository } from '@identity/domain/repositories'
import type { User } from '@identity/domain/entities'
import type { Database } from '@/core/infra/db/drizzle'

import { eq } from 'drizzle-orm'
import { users } from '@/core/infra/db/schema'
import { UserMapper } from '../mappers'
import { paginate } from '@/utils/paginate'

export class DrizzleUserRepository implements UserRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1)

    return result[0] ? UserMapper.toDomain(result[0]) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    return result[0] ? UserMapper.toDomain(result[0]) : null
  }

  async findAll(page: number, limit: number) {
    return paginate(this.db, users, page, limit, UserMapper.toDomain)
  }

  async save(user: User): Promise<void> {
    const dbUser = UserMapper.toPersistence(user)
    await this.db.insert(users).values(dbUser)
  }

  async updateLastLogin(userId: string): Promise<User | null> {
    const result = await this.db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userId))
      .returning()

    return result[0] ? UserMapper.toDomain(result[0]) : null
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.db.update(users).set({ isEmailVerified: true }).where(eq(users.id, userId))
  }
}
```

**Exemplo - Mapper:**

```typescript
// infrastructure/mappers/user-mapper.ts
import type { User } from '@identity/domain/entities'
import type { users } from '@/core/infra/db/schema'
import { createUser } from '@identity/domain/entities'

type DbUser = typeof users.$inferSelect

export class UserMapper {
  static toDomain(dbUser: DbUser): User {
    return createUser({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      password: dbUser.password,
      permissions: dbUser.permissions,
      isActive: dbUser.isActive,
      isEmailVerified: dbUser.isEmailVerified,
      lastLoginAt: dbUser.lastLoginAt ?? undefined,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    })
  }

  static toPersistence(user: User): typeof users.$inferInsert {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      permissions: user.permissions,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
```

**Exemplo - Service Implementation:**

```typescript
// infrastructure/services/email-service.ts
import type { EmailNotificationService } from '@identity/domain/services'
import type { Transporter } from 'nodemailer'

import { VerificationEmail } from '@repo/emails'
import { render } from '@react-email/render'

export class NodemailerEmailService implements EmailNotificationService {
  constructor(private transporter: Transporter) {}

  async sendVerificationEmail(data: { email: string; name: string; code: string }): Promise<void> {
    const html = render(VerificationEmail(data))

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: 'Verify your email',
      html,
    })
  }
}
```

### 4. Presentation Layer (Camada de Apresentação)

**Responsabilidade**: HTTP handlers, rotas ORPC

**Regras:**

- ✅ Define rotas usando contratos ORPC de `@repo/contracts`
- ✅ Chama casos de uso da camada de aplicação
- ✅ Lida com cookies, headers, status codes
- ✅ SEMPRE tem testes de integração (`.test.ts`)
- ✅ Mantém handlers simples - lógica nos casos de uso
- ❌ NÃO contém lógica de negócio

**Exemplo - Routes:**

```typescript
// presentation/http/identity-routes.ts
import { setCookie } from '@orpc/server/helpers'
import { pub, ENV, auth } from '@repo/service-core'
import { login, register, listUsers } from '@/modules/identity/di/container'

export const loginRoute = pub.identity.login.handler(async ({ input, context }) => {
  const token = await login(input)

  setCookie(context.resHeaders, ENV.COOKIE.NAME, token, {
    httpOnly: ENV.COOKIE.HTTP_ONLY,
    sameSite: ENV.COOKIE.SAME_SITE,
    secure: ENV.COOKIE.SECURE,
  })

  return { message: 'Login successful' }
})

export const registerRoute = pub.identity.register.handler(async ({ input }) => {
  await register(input)

  return {
    message: 'User registered successfully. Please check your email for verification code.',
  }
})

export const meRoute = auth.identity.me.handler(async ({ context: { user } }) => ({
  user,
}))

export const listUsersRoute = auth.identity.listUsers.handler(async ({ input }) => {
  const result = await listUsers(input.page, input.limit)

  return {
    users: result.data,
    meta: result.meta,
  }
})
```

**Testes de Integração:**

```typescript
// presentation/http/identity-routes.test.ts
import { it, vi, expect, describe, beforeEach } from 'vitest'
import { makeLogin } from '@/modules/identity/application/login'
import { makeListUsers } from '@/modules/identity/application/list-users'

describe('Identity Routes - Login', () => {
  let login: ReturnType<typeof makeLogin>

  beforeEach(() => {
    vi.resetAllMocks()
    login = makeLogin(mockUserRepository, mockJwtService)
  })

  it('should login successfully with valid credentials', async () => {
    // Test implementation
  })

  it('should throw unauthorized error with invalid credentials', async () => {
    // Test implementation
  })
})

describe('Identity Routes - List Users', () => {
  // Test implementation
})
```

### 5. Container (Dependency Injection)

**Responsabilidade**: Instanciar e conectar todas as dependências

**Regras:**

- ✅ Importa implementações concretas de infraestrutura
- ✅ Instancia casos de uso com dependências injetadas
- ✅ Exporta apenas casos de uso prontos para uso
- ✅ Centraliza toda a configuração de dependências

**Exemplo:**

```typescript
// di/container.ts
import { db } from '@/core/infra/db/drizzle'
import { emailTransporter } from '@/core/infra/email-transporter'
import { jwtService } from '@repo/service-core'

// Infrastructure
import { DrizzleUserRepository } from '../infrastructure/repositories/user-repository'
import { DrizzleEmailVerificationRepository } from '../infrastructure/repositories/email-verification-repository'
import { NodemailerEmailService } from '../infrastructure/services/smtp-email-sender'

// Application
import { makeLogin } from '../application/login'
import { makeRegister } from '../application/register'
import { makeListUsers } from '../application/list-users'
import { makeGetMe } from '../application/get-me'
import { makeVerifyEmail } from '../application/verify-email'
import { makeResendVerification } from '../application/resend-verification'

// Instanciar repositórios
const userRepository = new DrizzleUserRepository(db)
const emailVerificationRepository = new DrizzleEmailVerificationRepository(db)

// Instanciar serviços
const emailService = new NodemailerEmailService(emailTransporter)

// Exportar casos de uso com dependências injetadas
export const login = makeLogin(userRepository, jwtService)
export const register = makeRegister(userRepository, emailVerificationRepository, emailService)
export const listUsers = makeListUsers(userRepository)
export const getMe = makeGetMe(userRepository)
export const verifyEmail = makeVerifyEmail(userRepository, emailVerificationRepository)
export const resendVerification = makeResendVerification(
  userRepository,
  emailVerificationRepository,
  emailService
)
```

## 🗄️ Database Layer

### Drizzle Schema

```typescript
// core/infra/db/schema/users.schema.ts
import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  permissions: varchar('permissions', { length: 50 }).array().notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  isEmailVerified: boolean('is_email_verified').notNull().default(false),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
```

## 📝 Convenções e Boas Práticas

### Nomenclatura

- **Use Cases**: `make{UseCaseName}` - ex: `makeLogin`, `makeRegister`
- **Repositories**: `{Entity}Repository` - ex: `UserRepository`, interface ou classe
- **Services (Domain)**: `{Concept}Sender` / `{Concept}Service` - ex: `EmailNotificationService`
- **Services (Infra)**: `{Tech}{Concept}Sender` - ex: `SmtpEmailSender`, `NodemailerEmailService`
- **Mappers**: `{Entity}Mapper` - ex: `UserMapper`
- **Entities**: PascalCase - `User`, `EmailVerification`
- **Factory functions**: `create{Entity}` - ex: `createUser`
- **Test files**: `{use-case-name}.test.ts` dentro de `__tests__/`

### Testes

#### Unit Tests (Application Layer)

- ✅ Testar cada caso de uso isoladamente
- ✅ Mockar todas as dependências (repositories, services)
- ✅ Usar Arrange-Act-Assert pattern
- ✅ Testar casos de sucesso E falha
- ✅ Verificar que dependências foram chamadas corretamente

#### Integration Tests (Presentation Layer)

- ✅ Testar handlers de rotas
- ✅ Mockar apenas infraestrutura (DB, Email, etc)
- ✅ Testar fluxo completo da requisição
- ✅ Verificar respostas HTTP corretas

### Error Handling

Use os helpers do `@repo/service-core`:

```typescript
import { badRequest, unauthorized, notFound, conflict } from '@repo/service-core'

// Bad Request (400)
throw badRequest('Invalid input data')

// Unauthorized (401)
throw unauthorized('Invalid credentials')

// Not Found (404)
throw notFound('User not found')

// Conflict (409)
throw conflict('Email already exists')
```

### Validação

- ✅ Validação de schemas acontece no contrato (ORPC)
- ✅ Validação de regras de negócio na camada de aplicação
- ✅ Validação de formato nos factory functions das entidades

## 🚀 Ao Adicionar Novos Módulos

**Checklist obrigatório:**

1. **Criar estrutura de pastas**:

   ```
   src/modules/new-module/
   ├── domain/
   │   ├── entities/
   │   ├── repositories/
   │   └── services/
   ├── application/
   │   └── __tests__/
   ├── infrastructure/
   │   ├── repositories/
   │   ├── mappers/
   │   └── services/
   ├── presentation/
   │   └── http/
   └── di/
       └── container.ts
   ```

2. **Domain Layer**:

   - [ ] Criar entidades com factory functions
   - [ ] Definir interfaces de repositórios
   - [ ] Definir interfaces de serviços (se necessário) com nome descritivo (ex: `email-sender.ts`)
   - [ ] Sem dependências externas

3. **Application Layer**:

   - [ ] Criar casos de uso com factory pattern
   - [ ] Criar pasta `__tests__/`
   - [ ] Criar testes unitários `{use-case}.test.ts` para cada caso de uso
   - [ ] Usar apenas interfaces do domínio
   - [ ] Incluir tratamento de erros

4. **Infrastructure Layer**:

   - [ ] Implementar repositórios (Drizzle)
   - [ ] Criar mappers (DB <-> Domain)
   - [ ] Implementar serviços externos com nome específico (ex: `smtp-email-sender.ts`)
   - [ ] Criar schemas do Drizzle

5. **Presentation Layer**:

   - [ ] Criar pasta `http/` (ou `websocket/`, `graphql/` conforme necessário)
   - [ ] Criar rotas usando contratos ORPC
   - [ ] Criar testes de integração
   - [ ] Manter handlers simples

6. **Dependency Injection**:

   - [ ] Criar pasta `di/`
   - [ ] Criar `container.ts`
   - [ ] Instanciar todas as dependências
   - [ ] Injetar dependências nos casos de uso
   - [ ] Exportar casos de uso prontos

7. **Router**:
   ```typescript
   // src/router.ts
   import * as newModuleRoutes from '@/modules/new-module/presentation/http/new-module-routes'
   export const router = {
     // ... existing routes
     newModule: newModuleRoutes,
   }
   ```

## 🔍 Exemplo Completo: Fluxo de Requisição

```
HTTP Request
    ↓
[Presentation Layer - HTTP]
presentation/http/identity-routes.ts → Recebe requisição, chama caso de uso
    ↓
[Dependency Injection]
di/container.ts → Resolve dependências
    ↓
[Application Layer]
application/login.ts → Orquestra lógica de negócio
    ↓
[Domain Layer]
domain/repositories/user-repository.ts (interface) → Define contrato
    ↓
[Infrastructure Layer]
infrastructure/repositories/user-repository.ts (impl) → Acessa banco de dados
    ↓
[Infrastructure Layer - Mapper]
infrastructure/mappers/user-mapper.ts → Converte DB Model → Domain Entity
    ↓
[Application Layer]
application/login.ts → Processa e retorna resultado
    ↓
[Presentation Layer - HTTP]
presentation/http/identity-routes.ts → Formata resposta HTTP
    ↓
HTTP Response
```

## ⚠️ Evite

- ❌ Lógica de negócio na camada de apresentação
- ❌ Acesso direto ao DB fora da infraestrutura
- ❌ Dependências circulares entre camadas
- ❌ Entidades anêmicas (sem comportamento)
- ❌ Casos de uso sem testes
- ❌ Misturar concerns entre camadas
- ❌ Usar tipos do Drizzle diretamente no domínio
- ❌ Instanciar dependências diretamente (use o container)

## 📚 Referências

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [ORPC Documentation](https://orpc.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Vitest](https://vitest.dev/)

## 💡 Exemplos Completos

Consulte o módulo `identity` para referência completa de implementação:

- `src/modules/identity/domain/` - Entidades e interfaces puras
- `src/modules/identity/application/` - Casos de uso
- `src/modules/identity/application/__tests__/` - Testes unitários dos casos de uso
- `src/modules/identity/infrastructure/` - Implementações concretas
- `src/modules/identity/presentation/http/` - Rotas HTTP com testes
- `src/modules/identity/di/container.ts` - Dependency injection

---

**Lembre-se:** A arquitetura existe para manter o código organizado, testável e manutenível. Siga os princípios SOLID e mantenha as responsabilidades bem separadas entre as camadas.
