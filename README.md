# Chat Monorepo

Sistema de chat completo com suporte a mensagens em tempo real, chamadas de áudio/vídeo e WebSocket.

## 🤖 Agentes de IA (GitHub Copilot)

Este projeto possui agentes de IA personalizados que aceleram o desenvolvimento e garantem consistência:

### 🚀 Quick Start

- 👋 **Novo no projeto?** → [Guia de Onboarding](.github/ONBOARDING.md)
- ⚡ **Precisa de referência?** → [Comandos Rápidos](.github/QUICK-REFERENCE.md)
- 💡 **Quer ver exemplos?** → [Exemplos Práticos](.github/EXAMPLES.md)
- ❓ **Tem dúvidas?** → [FAQ](.github/FAQ.md)

### 🤖 Agentes Disponíveis

| Agente                                                                       | Escopo       | Quando Usar                      |
| ---------------------------------------------------------------------------- | ------------ | -------------------------------- |
| 🎯 [Geral](.github/copilot-instructions.md)                                  | Todo projeto | Arquitetura, DDD, padrões gerais |
| 📦 [Contratos](packages/contracts/.github/copilot-instructions.md)           | APIs         | Schemas Zod, rotas ORPC          |
| 🔌 [WebSocket](packages/contracts/.github/copilot-websocket-instructions.md) | Tempo Real   | Eventos, WebRTC                  |

**📚 [Documentação Completa](.github/README.md)** | **📑 [Índice Completo](.github/INDEX.md)**

> 💡 Os agentes carregam automaticamente baseado no arquivo que você está editando!

---

## 📐 Arquitetura

```mermaid
graph TD
    subgraph " "
        Client([<fa:fa-user> Client / Frontend])
    end

    subgraph "Presentation Layer (Camada de Apresentação)"
        direction LR
        A[<fa:fa-server> oRPC Server <br> index.ts] --> B[<fa:fa-route> Router <br> router.ts]
        B --> C[<fa:fa-id-card> Identity Routes <br> identityRoutes.ts]
        B --> D[<fa:fa-paw> Animal Routes <br> animalRoutes.ts]
    end

    subgraph "Composition Root (Injeção de Dependência)"
        E[<fa:fa-cogs> DI Container <br> container.ts]
    end

    subgraph "Application Layer (Casos de Uso)"
        direction LR
        F[<fa:fa-user-plus> Identity Use Cases <br> e.g., register.ts]
        G[<fa:fa-dog> Animal Use Cases <br> e.g., createAnimal.ts]
    end

    subgraph "Domain Layer (Entidades e Contratos)"
        direction LR
        H[<fa:fa-address-book> User Entity <br> user.ts]
        I[<fa:fa-file-contract> IUserRepository <br> userRepository.ts]
        J[<fa:fa-hippo> Animal Entity <br> animal.ts]
        K[<fa:fa-file-contract> IAnimalRepository <br> animalRepository.ts]
    end

    subgraph "Infrastructure Layer (Implementações e Dados)"
        direction LR
        L[<fa:fa-database> UserRepositoryImpl] --> N[<fa:fa-exchange-alt> UserMapper]
        M[<fa:fa-database> AnimalRepositoryImpl] --> O[<fa:fa-exchange-alt> AnimalMapper]
        N --> P[<fa:fa-plug> Prisma Client]
        O --> P
    end

    subgraph "External Services"
        Q[(<fa:fa-database> PostgreSQL DB)]
    end

    %% Fluxo de Dependências
    Client --> A

    %% Presentation -> DI Container (para obter casos de uso)
    C --> E
    D --> E

    %% DI Container -> Instancia Casos de Uso e Repositórios
    E -- "instancia" --> F
    E -- "instancia" --> G
    E -- "injeta" --> L
    E -- "injeta" --> M

    %% Application -> Domain (depende das interfaces)
    F --> I
    G --> K

    %% Infrastructure -> Domain (implementa interfaces e usa entidades)
    L -- "implementa" --> I
    M -- "implementa" --> K
    N -- "cria" --> H
    O -- "cria" --> J

    %% Infrastructure -> External Services
    P --> Q

    %% Definições de Estilo
    classDef presentation fill:#87CEEB,stroke:#333,stroke-width:2px,color:#000
    classDef application fill:#98FB98,stroke:#333,stroke-width:2px,color:#000
    classDef domain fill:#FFD700,stroke:#333,stroke-width:2px,color:#000
    classDef infrastructure fill:#F08080,stroke:#333,stroke-width:2px,color:#000
    classDef container fill:#DDA0DD,stroke:#333,stroke-width:2px,color:#000

    class A,B,C,D presentation
    class F,G application
    class H,I,J,K domain
    class L,M,N,O,P infrastructure
    class E container
```
