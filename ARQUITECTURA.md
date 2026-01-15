# Arquitectura Hexagonal - Diagrama y Decisiones

## Diagrama de Componentes

```mermaid
graph TB
    subgraph FRONTEND["🖥️ FRONTEND (React + TypeScript)"]
        subgraph UI_ADAPTER["Driving Adapter - UI"]
            AppTSX["App.tsx<br/>- Estado UI<br/>- Eventos<br/>- Renderizado"]
        end

        subgraph FRONTEND_DOMAIN["Domain - Frontend"]
            FE_ENTITIES["📦 Entities<br/>Task"]
            FE_USECASES["⚙️ Use Cases<br/>CreateTask<br/>GetAllTasks"]
            FE_PORT["🔌 Port<br/>TaskRepository<br/>(interface)"]

            FE_USECASES --> FE_ENTITIES
            FE_USECASES --> FE_PORT
        end

        subgraph HTTP_ADAPTER["Driven Adapter - HTTP Client"]
            HttpRepo["HttpTaskRepository<br/>- fetch GET /tasks<br/>- fetch POST /tasks"]
        end

        AppTSX --> FE_USECASES
        HttpRepo -.implements.-> FE_PORT
    end

    subgraph BACKEND["🖧 BACKEND (Node.js + TypeScript)"]
        subgraph EXPRESS_ADAPTER["Driving Adapter - HTTP Server"]
            ExpressAdp["ExpressAdapter<br/>- GET /tasks<br/>- POST /tasks"]
        end

        subgraph BACKEND_DOMAIN["Domain - Backend"]
            BE_ENTITIES["📦 Entities<br/>Task<br/>- create()<br/>- complete()"]
            BE_USECASES["⚙️ Use Cases<br/>CreateTask<br/>GetAllTasks"]
            BE_PORT["🔌 Port<br/>TaskRepository<br/>(interface)"]

            BE_USECASES --> BE_ENTITIES
            BE_USECASES --> BE_PORT
        end

        subgraph PERSISTENCE_ADAPTER["Driven Adapter - Persistence"]
            InMemoryRepo["InMemoryTaskRepository<br/>- Map&lt;string, Task&gt;<br/>- Almacenamiento en memoria"]
        end

        ExpressAdp --> BE_USECASES
        InMemoryRepo -.implements.-> BE_PORT
    end

    HttpRepo -->|"HTTP Request<br/>(fetch API)"| ExpressAdp

    style FRONTEND fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style BACKEND fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style FRONTEND_DOMAIN fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
    style BACKEND_DOMAIN fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
    style UI_ADAPTER fill:#b3e5fc,stroke:#0277bd,stroke-width:2px
    style HTTP_ADAPTER fill:#b3e5fc,stroke:#0277bd,stroke-width:2px
    style EXPRESS_ADAPTER fill:#ffe0b2,stroke:#ef6c00,stroke-width:2px
    style PERSISTENCE_ADAPTER fill:#ffe0b2,stroke:#ef6c00,stroke-width:2px
```

## Flujo de Datos Completo

```mermaid
sequenceDiagram
    actor User as 👤 Usuario
    participant UI as App.tsx<br/>(UI Adapter)
    participant FE_UC as CreateTask<br/>(Frontend UseCase)
    participant HTTP as HttpTaskRepository<br/>(HTTP Adapter)
    participant API as ExpressAdapter<br/>(API Adapter)
    participant BE_UC as CreateTask<br/>(Backend UseCase)
    participant REPO as InMemoryTaskRepository<br/>(Persistence Adapter)

    User->>UI: Escribe "Comprar leche"<br/>y hace click en "Add Task"
    UI->>FE_UC: execute("Comprar leche")
    FE_UC->>HTTP: create("Comprar leche")
    HTTP->>API: POST /tasks<br/>{ title: "Comprar leche" }
    API->>BE_UC: execute("Comprar leche")
    BE_UC->>BE_UC: Task.create(id, "Comprar leche")
    BE_UC->>REPO: save(task)
    REPO->>REPO: Map.set(id, task)
    REPO-->>BE_UC: void
    BE_UC-->>API: Task { id, title, completed }
    API-->>HTTP: 201 JSON { id, title, completed }
    HTTP-->>FE_UC: Task
    FE_UC-->>UI: Task
    UI-->>User: Muestra tarea en la lista
```

## Explicación de las Capas

### 🎯 Domain (Núcleo - Verde)

**Responsabilidad**: Contiene la lógica de negocio pura e independiente de tecnología.

**Componentes**:
- **Entities**: `Task` - Objeto del dominio con reglas de negocio
- **Use Cases**: `CreateTask`, `GetAllTasks` - Casos de uso de la aplicación
- **Ports**: `TaskRepository` - Interfaces que definen contratos

**Regla de Oro**: Esta capa NO conoce nada del mundo exterior (frameworks, librerías, HTTP, React, etc.)

**Duplicación Frontend/Backend**: El dominio está duplicado porque cada aplicación evoluciona independientemente. En un monorepo empresarial, podrías tener:
```
packages/
  ├── domain-shared/    # Dominio compartido
  ├── frontend/
  └── backend/
```

### 🔵 Driving Adapters (Adaptadores Primarios - Azul Claro)

**Responsabilidad**: Inician las acciones en el sistema. Son los puntos de entrada.

**Frontend**: `App.tsx`
- Captura eventos del usuario (clicks, formularios)
- Gestiona estado de UI (useState, useEffect)
- Traduce interacciones en llamadas a use cases
- Renderiza con React (framework específico)

**Backend**: `ExpressAdapter`
- Recibe peticiones HTTP
- Parsea requests (JSON, query params)
- Llama a use cases correspondientes
- Formatea respuestas HTTP

**Por qué son Adapters**: Adaptan protocolos externos (UI events, HTTP) al lenguaje del dominio.

### 🟠 Driven Adapters (Adaptadores Secundarios - Naranja)

**Responsabilidad**: Responden a peticiones del dominio. Implementan los ports.

**Frontend**: `HttpTaskRepository`
- Implementa el port `TaskRepository`
- Usa `fetch` para comunicarse con el backend
- Transforma JSON en entidades del dominio

**Backend**: `InMemoryTaskRepository`
- Implementa el port `TaskRepository`
- Usa `Map<string, Task>` para almacenar datos
- Podría reemplazarse por `PostgresTaskRepository` sin cambiar el dominio

**Por qué son Adapters**: Adaptan tecnologías específicas (HTTP, DB) a las interfaces del dominio.

## Decisiones Arquitectónicas

### 1. ✅ Inversión de Dependencias

```
Dominio define → Port (interface)
                    ↑
                    | implementa
                    |
Adapter → implementa la interface
```

**Beneficio**: El dominio no depende de los adapters. Puedes cambiar la implementación sin tocar la lógica de negocio.

### 2. ✅ Dependency Injection Manual

**Frontend** (`App.tsx`):
```typescript
const taskRepository = new HttpTaskRepository('http://localhost:3000');
const createTaskUseCase = new CreateTask(taskRepository);
```

**Backend** (`index.ts`):
```typescript
const taskRepository = new InMemoryTaskRepository();
const createTask = new CreateTask(taskRepository);
const httpAdapter = new ExpressAdapter(createTask, getAllTasks);
```

**Beneficio**: Fácil de testear. Puedes inyectar mocks en los tests.

### 3. ✅ Separation of Concerns

Cada componente tiene una única responsabilidad:
- **Entities**: Reglas de negocio
- **Use Cases**: Orquestación de la lógica
- **Ports**: Contratos
- **Adapters**: Detalles de implementación

### 4. ✅ Framework Independence

El dominio no importa:
- ❌ `express`
- ❌ `react`
- ❌ `fetch`
- ✅ Solo TypeScript puro

**Beneficio**: Puedes migrar de Express a Fastify, o React a Vue sin tocar el dominio.

### 5. ✅ Simplicidad para Aprendizaje

Para mantener el ejemplo educativo:
- Sin base de datos real → `InMemoryTaskRepository`
- Sin autenticación/autorización
- Sin DTOs (Data Transfer Objects)
- Sin validaciones complejas
- Sin manejo exhaustivo de errores

## Comparación con Arquitecturas Tradicionales

### ❌ Arquitectura en Capas Tradicional
```
UI → Controller → Service → Repository → DB
     (Acoplamiento vertical - cambiar DB afecta todo)
```

### ✅ Arquitectura Hexagonal
```
      Driving Adapters (UI, HTTP)
              ↓
           DOMAIN
              ↓
      Driven Adapters (DB, APIs)

(Puedes cambiar adapters sin afectar el dominio)
```

## Cómo Extender la Arquitectura

### Agregar nuevo Use Case

1. Crea el use case en `domain/useCases/CompleteTask.ts`
2. Usa el port existente `TaskRepository`
3. Actualiza los adapters para exponer el nuevo caso de uso

### Cambiar de InMemory a PostgreSQL

1. Crea `PostgresTaskRepository.ts` en `adapters/repositories/`
2. Implementa la interface `TaskRepository`
3. Cambia la inyección en `index.ts`:
```typescript
// Antes
const taskRepository = new InMemoryTaskRepository();

// Después
const taskRepository = new PostgresTaskRepository(connectionString);
```

✅ **Sin tocar el dominio ni los use cases**

### Agregar GraphQL además de REST

1. Crea `GraphQLAdapter.ts` en `adapters/http/`
2. Usa los mismos use cases existentes
3. Ambos adapters (Express y GraphQL) usan el mismo dominio

## Testing en Arquitectura Hexagonal

```typescript
// Test del Use Case (sin necesidad de HTTP ni DB)
describe('CreateTask', () => {
  it('should create a task', async () => {
    const mockRepo: TaskRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn()
    };

    const useCase = new CreateTask(mockRepo);
    const task = await useCase.execute('Test task');

    expect(mockRepo.save).toHaveBeenCalledWith(task);
  });
});
```

**Ventaja**: Tests rápidos, sin dependencias externas.

## Recursos Adicionales

- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Ports and Adapters Pattern](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)
