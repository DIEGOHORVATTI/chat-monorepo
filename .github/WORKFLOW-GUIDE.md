# 🎨 Guia Visual de Fluxo de Trabalho

Diagramas e fluxos visuais para trabalhar com os agentes de IA.

## 🔄 Fluxo de Criação de Módulo

```mermaid
graph TD
    A[💡 Ideia: Novo Módulo] --> B[📋 Planejar]
    B --> C{Tipo de Módulo?}
    
    C -->|REST API| D[🎯 Usar Agente de Contratos]
    C -->|WebSocket| E[🔌 Usar Agente WebSocket]
    C -->|Misto| F[🎯🔌 Usar Ambos]
    
    D --> G[1️⃣ Criar types.ts]
    E --> G
    F --> G
    
    G --> H[2️⃣ Criar *.schema.ts]
    H --> I[3️⃣ Criar *.contract.ts]
    I --> J[4️⃣ Criar index.ts]
    J --> K[5️⃣ Integrar em src/index.ts]
    
    K --> L{✅ Checklist OK?}
    L -->|Sim| M[🎉 Pronto!]
    L -->|Não| N[🔧 Ajustar]
    N --> G
    
    style A fill:#FFD700
    style M fill:#98FB98
    style L fill:#87CEEB
    style N fill:#FFA07A
```

## 🎯 Princípio de Inversão de Dependência

```mermaid
graph LR
    subgraph "Camada de Abstração (types.ts)"
        A[Interface User]
    end
    
    subgraph "Camada de Implementação"
        B[Zod Schema]
        C[ORPC Contract]
        D[Backend Implementation]
        E[Frontend Consumer]
    end
    
    A -.->|satisfies| B
    A -.->|implementa| D
    A -.->|usa tipos de| E
    B -->|valida| D
    C -->|usa schemas| B
    
    style A fill:#FFD700,stroke:#333,stroke-width:3px
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#98FB98
    style E fill:#DDA0DD
```

## 🔌 Fluxo de Eventos WebSocket

```mermaid
sequenceDiagram
    participant Dev as 👨‍💻 Desenvolvedor
    participant Agent as 🤖 Agente WebSocket
    participant Code as 📝 Código Gerado
    
    Dev->>Agent: "Crie evento USER_TYPING"
    
    Agent->>Code: 1. Adiciona ao enum
    Note over Code: WebSocketEventType.USER_TYPING
    
    Agent->>Code: 2. Cria interface
    Note over Code: interface UserTypingEvent
    
    Agent->>Code: 3. Cria schema Zod
    Note over Code: userTypingEventSchema
    
    Agent->>Code: 4. Adiciona ao union
    Note over Code: discriminatedUnion
    
    Code->>Dev: ✅ Código completo!
    
    Dev->>Agent: "Revise o código"
    Agent->>Dev: ✅ Validações OK<br/>✅ Padrões OK<br/>✅ Type-safe
```

## 🏗️ Estrutura de Decisão

```mermaid
graph TD
    A[🤔 O que preciso criar?] --> B{Tipo?}
    
    B -->|Entidade/Model| C[📄 types.ts]
    B -->|Validação| D[🔍 *.schema.ts]
    B -->|Rota API| E[🌐 *.contract.ts]
    B -->|Evento Tempo Real| F[⚡ websocket.schema.ts]
    
    C --> G[Define Interface]
    D --> H[Cria Schema Zod<br/>com satisfies]
    E --> I[Define Rota ORPC<br/>com docs]
    F --> J[Define Evento<br/>discriminated union]
    
    G --> K{Precisa validação?}
    K -->|Sim| D
    K -->|Não| L[✅ Pronto]
    
    H --> M{Precisa API?}
    M -->|Sim| E
    M -->|Não| L
    
    I --> N{Precisa evento?}
    N -->|Sim| F
    N -->|Não| L
    
    J --> L
    
    style A fill:#FFD700
    style L fill:#98FB98
```

## 📊 Matriz de Decisão: Qual Agente Usar?

| Necessidade | Agente | Arquivo Alvo | Exemplo |
|------------|---------|--------------|---------|
| Criar novo módulo REST | 📦 Contratos | `src/modules/*/` | Produtos, Pedidos |
| Adicionar validações | 📦 Contratos | `*.schema.ts` | Email, CPF, UUID |
| Definir rotas API | 📦 Contratos | `*.contract.ts` | GET, POST, PATCH |
| Eventos de chat | 🔌 WebSocket | `websocket/` | MESSAGE_RECEIVED |
| Eventos de chamada | 🔌 WebSocket | `calls/` | CALL_STARTED |
| Sinalização WebRTC | 🔌 WebSocket | `calls/` | OFFER, ANSWER |
| Arquitetura geral | 🎯 Geral | Qualquer | Estrutura, DDD |

## 🎨 Padrão de Codificação Visual

### ✅ CERTO: Com Satisfies

```typescript
// 1. Interface limpa (types.ts)
┌─────────────────────────────┐
│ export interface User {     │
│   id: string                │
│   email: string             │
│   name: string              │
│ }                            │
└─────────────────────────────┘
            │
            │ satisfies
            ▼
// 2. Schema implementa (*.schema.ts)
┌─────────────────────────────────────┐
│ export const userSchema = z.object({│
│   id: z.string().uuid(),            │
│   email: z.email(),                 │
│   name: z.string().min(1),          │
│ }) satisfies z.ZodType<User>        │
└─────────────────────────────────────┘
            │
            │ garante compatibilidade
            ▼
        ✅ Type-safe!
```

### ❌ ERRADO: Sem Satisfies

```typescript
// Schema pode divergir da interface
┌─────────────────────────────┐
│ interface User {            │
│   id: string                │
│   email: string             │
│   name: string              │
│ }                            │
└─────────────────────────────┘
            │
            ✗ sem ligação
            ▼
┌─────────────────────────────┐
│ const userSchema = z.object(│
│   id: z.string(),           │
│   email: z.string(),        │
│   // name esquecido! 😢     │
│ })                          │
└─────────────────────────────┘
            │
            ▼
        ❌ Não type-safe!
```

## 🔄 Ciclo de Desenvolvimento

```mermaid
graph LR
    A[💭 Pensar] --> B[💬 Perguntar ao Agente]
    B --> C[📝 Revisar Código]
    C --> D{Está OK?}
    D -->|Sim| E[✅ Commit]
    D -->|Não| F[🔧 Ajustar]
    F --> B
    E --> G[🚀 Deploy]
    
    style A fill:#FFE4B5
    style B fill:#87CEEB
    style C fill:#DDA0DD
    style E fill:#98FB98
    style F fill:#FFA07A
    style G fill:#90EE90
```

## 🎯 Prompt Templates Visuais

### Template 1: Módulo REST

```
┌────────────────────────────────────────┐
│ 📦 CRIAR MÓDULO [NOME]                 │
├────────────────────────────────────────┤
│                                        │
│ 📋 Entidades:                          │
│   • [Nome]: campo1, campo2, ...        │
│                                        │
│ 🏷️  Enums:                             │
│   • [Nome]: VALUE1, VALUE2, ...        │
│                                        │
│ 🌐 Rotas:                              │
│   • GET /[path] - listar               │
│   • POST /[path] - criar               │
│   • PATCH /[path]/:id - atualizar      │
│   • DELETE /[path]/:id - deletar       │
│                                        │
│ ✅ Seguir padrões DIP + satisfies      │
└────────────────────────────────────────┘
```

### Template 2: Evento WebSocket

```
┌────────────────────────────────────────┐
│ ⚡ CRIAR EVENTO [NOME]                  │
├────────────────────────────────────────┤
│                                        │
│ 🎯 Direção:                            │
│   ○ Cliente → Servidor                 │
│   ○ Servidor → Cliente                 │
│                                        │
│ 📦 Dados:                              │
│   • campo1: tipo (validação)           │
│   • campo2: tipo (validação)           │
│                                        │
│ 📝 Quando ocorre:                      │
│   [Descrição...]                       │
│                                        │
│ ✅ Padrão: enum + interface + schema   │
└────────────────────────────────────────┘
```

## 🗺️ Mapa Mental de Decisões

```
                    🤔 Preciso criar...
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    🎨 UI/UX          📊 Dados           🔧 Lógica
        │                  │                  │
        │          ┌───────┴────────┐         │
        │          │                │         │
        │      📝 Tipo          🔍 Validação   │
        │          │                │         │
        │      types.ts        *.schema.ts    │
        │                          │          │
        │                  ┌───────┴────────┐ │
        │                  │                │ │
        │              🌐 REST        ⚡ WebSocket
        │                  │                │
        │          *.contract.ts   websocket/
        │                  │                │
        └──────────────────┴────────────────┴─┘
                           │
                      ✅ Completo!
```

## 📈 Níveis de Complexidade

```mermaid
graph LR
    A[Nível 1<br/>Simple] --> B[Nível 2<br/>Intermediário]
    B --> C[Nível 3<br/>Avançado]
    C --> D[Nível 4<br/>Expert]
    
    subgraph "Nível 1: Entidades Básicas"
        A1[Interface]
        A2[Schema]
    end
    
    subgraph "Nível 2: APIs REST"
        B1[+ Contratos ORPC]
        B2[+ Validações]
    end
    
    subgraph "Nível 3: Tempo Real"
        C1[+ WebSocket]
        C2[+ Eventos]
    end
    
    subgraph "Nível 4: WebRTC"
        D1[+ Sinalização]
        D2[+ Controle Mídia]
    end
    
    style A fill:#98FB98
    style B fill:#87CEEB
    style C fill:#DDA0DD
    style D fill:#FFD700
```

## 🎓 Jornada de Aprendizado

```
👶 Iniciante
    │
    ├─ Entender DIP
    ├─ Aprender satisfies
    ├─ Criar primeiro módulo
    └─ Usar Pick/Omit/Extend
    
👨‍🎓 Intermediário
    │
    ├─ Criar rotas ORPC completas
    ├─ Adicionar validações customizadas
    ├─ Implementar eventos WebSocket
    └─ Usar discriminated unions
    
👨‍💻 Avançado
    │
    ├─ Arquitetar módulos complexos
    ├─ Implementar WebRTC
    ├─ Otimizar schemas
    └─ Contribuir com agentes
    
🧙 Expert
    │
    ├─ Criar novos padrões
    ├─ Mentoria de time
    ├─ Evoluir arquitetura
    └─ Liderar inovações
```

## 🎯 Objetivos por Sprint

```mermaid
gantt
    title Evolução do Desenvolvimento
    dateFormat  YYYY-MM-DD
    
    section Sprint 1
    Aprender Padrões      :a1, 2025-11-30, 7d
    Criar Primeiro Módulo :a2, after a1, 5d
    
    section Sprint 2
    Adicionar Validações  :b1, after a2, 7d
    Implementar WebSocket :b2, after b1, 7d
    
    section Sprint 3
    Dominar ORPC          :c1, after b2, 7d
    Criar Módulo Complexo :c2, after c1, 7d
    
    section Sprint 4
    Implementar WebRTC    :d1, after c2, 14d
    Otimizações          :d2, after d1, 7d
```

## 🔍 Checklist Visual

### ✅ Novo Módulo

```
┌─────────────────────────────────┐
│ □ Criar diretório               │
│ □ types.ts com interfaces       │
│ □ *.schema.ts com satisfies     │
│ □ *.contract.ts com docs        │
│ □ index.ts com exports          │
│ □ Adicionar em src/index.ts    │
│ □ Testar imports                │
│ □ Documentar se necessário      │
└─────────────────────────────────┘
```

### ✅ Novo Evento WebSocket

```
┌─────────────────────────────────┐
│ □ Adicionar ao enum             │
│ □ Criar interface               │
│ □ Criar schema com z.literal()  │
│ □ Adicionar ao discriminated    │
│ □ Incluir timestamp             │
│ □ Adicionar requestId opcional  │
│ □ Documentar quando ocorre      │
│ □ Testar no cliente             │
└─────────────────────────────────┘
```

## 🎨 Paleta de Comandos

```bash
# 🚀 Comandos Rápidos para o Copilot

# Módulo
"Crie módulo de [nome]"
"Adicione validação em [campo]"
"Refatore usando Pick/Omit"

# WebSocket
"Adicione evento [NOME]"
"Implemente discriminated union"
"Crie base event schema"

# WebRTC
"Implemente sinalização offer/answer"
"Adicione controle de mídia"
"Crie evento de ICE candidate"

# Geral
"Revise este código"
"Como melhorar [aspecto]?"
"Exemplos de [conceito]"
```

---

**💡 Use este guia visual como referência rápida durante o desenvolvimento!**
