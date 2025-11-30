# Backend Copilot Instructions

This is a **Bun** backend using **oRPC** (type-safe RPC framework), **Prisma ORM**, and **PostgreSQL** with Clean Architecture principles.

## Architecture Overview

### ✅ Clean Architecture Implementation

The codebase follows a **proper Clean Architecture pattern** with dependency injection:

```
src/modules/{feature}/
├── domain/          # Entities, enums, repository interfaces
├── application/     # Use cases (business logic)
├── infrastructure/  # Prisma repository implementations
└── presentation/    # oRPC route definitions
```

**Key Pattern**: Dependencies are wired in `src/container.ts` - routes receive use cases as dependencies, avoiding direct infrastructure imports.

### Dependency Flow

- **Domain**: Pure business entities (`createAnimal`, `User` types)
- **Application**: Use cases (`makeCreateAnimal`) that depend on repository interfaces
- **Infrastructure**: Repository implementations (`makeUserRepository`) using Prisma
- **Presentation**: Route handlers that receive use cases from container
- **Container**: Dependency injection root that wires everything together

### Route Registration

- Central router in `src/router.ts` exports type-safe API contract
- Routes use oRPC's declarative syntax with Zod validation
- Auto-generated OpenAPI docs at `/docs` (Scalar UI)
- Each route imports use cases from `src/container.ts`

### Core Stack

- **Runtime**: Bun (use `bun` commands, not `npm`)
- **Database**: Single Prisma instance in `src/infra/prisma.ts`
- **Auth**: JWT tokens, bcrypt hashing, HTTP-only cookies
- **Validation**: Zod schemas for all inputs/outputs
- **Errors**: Standardized oRPC errors from `src/core/infra/http/errors/apiError.ts`

## Essential Development Patterns

### ✅ Proper Implementation Pattern:

```typescript
// src/container.ts - Dependency injection root
const userRepository = makeUserRepository()
export const login = makeLogin(userRepository)

// presentation/routes/identityRoutes.ts - Clean dependencies
import { login } from '@/container'
export const loginRoute = prefix.route({...}).handler(async ({ input }) => {
  return await login(input)
})
```

### Error Handling

Use standardized oRPC errors from `src/core/infra/http/errors/apiError.ts`:

```typescript
import { unauthorized, badRequest, notFound } from '@repo/service-core'
throw unauthorized('Invalid credentials')
```

### Database Operations

- Use shared Prisma instance: `import { prisma } from '@/infra/prisma'`
- Repository pattern with mappers for domain/persistence translation
- Upsert pattern in repositories: `prisma.user.upsert({ where: { id }, update, create })`

### Configuration

- Environment variables in `src/constants/config.ts` with fallback defaults
- JWT config includes cookie security settings based on NODE_ENV
- Email, S3, and database URLs configured via environment

## Critical Commands

### Development

```bash
bun dev          # Start development server with hot reload
bun build        # Build for production
bun start        # Run production build
```

### Database

```bash
bunx prisma migrate dev    # Apply schema changes
bunx prisma generate       # Generate Prisma client
bunx prisma studio         # Open database GUI
```

### Code Quality

```bash
bun lint         # ESLint
bun type-check   # TypeScript compilation check
```

## Project Conventions

### Import Aliases

- `@/` maps to `src/` directory
- Always use absolute imports with the alias

### Authentication Flow

1. Login/register routes return JWT tokens in response body
2. Token payload includes user data
3. Cookie configuration handled in route layer (httpOnly, secure based on NODE_ENV)

### Entity Creation Pattern

Domain entities use factory functions:

```typescript
// Domain layer
export const createAnimal = (props: AnimalProps, id?: string): Animal => ({
  id: id || crypto.randomUUID(),
  ...props,
})
```

### Repository Pattern

Infrastructure repositories implement domain interfaces:

```typescript
export const makeUserRepository = (): UserRepository => ({
  async save(user) {
    const data = UserMapper.toPersistence(user)
    await prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: data,
    })
  },
})
```

## Integration Points

- **API Docs**: Auto-generated OpenAPI at `http://localhost:8000/api/docs` (Scalar UI)
- **Database**: PostgreSQL via Prisma with connection pooling
- **Email**: Nodemailer SMTP + React Email templates in `src/emails/`
- **File Storage**: AWS S3 integration configured via environment variables

### When Adding Features:

1. **Start with Domain**: Define entities with `createEntity` factory functions
2. **Repository Interface**: Create domain interface, implement in infrastructure
3. **Use Cases**: Application layer with repository dependencies
4. **Wire in Container**: Export use cases from `src/container.ts`
5. **Routes**: Import use cases from container, never infrastructure directly
