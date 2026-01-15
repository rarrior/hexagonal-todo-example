# TODO App - Arquitectura Hexagonal

Este es un proyecto de ejemplo super simple para entender los conceptos basicos de **Arquitectura Hexagonal** (tambien conocida como **Ports and Adapters**).

## Que es Arquitectura Hexagonal?

La arquitectura hexagonal separa tu aplicacion en tres capas principales:

### 1. **Domain (Nucleo)**
- Contiene la logica de negocio pura
- **Entities**: Los objetos del dominio (`Task.ts`)
- **Use Cases**: La logica de aplicacion (`CreateTask.ts`, `GetAllTasks.ts`)
- **Ports**: Interfaces que definen como el dominio se comunica con el exterior (`TaskRepository.ts`)
- **Regla de oro**: Esta capa NO conoce nada del mundo exterior (HTTP, Base de datos, UI, etc.)

### 2. **Ports (Interfaces)**
- Definen contratos entre el dominio y el mundo exterior
- Son interfaces/abstracciones que el dominio necesita
- Ejemplo: `TaskRepository` define que necesitamos guardar y obtener tareas, pero NO dice COMO

### 3. **Adapters (Implementaciones)**
- Implementaciones concretas de los ports
- **Repositories**: Como guardamos los datos (`InMemoryTaskRepository.ts`, `HttpTaskRepository.ts`)
- **HTTP/API**: Como exponemos la funcionalidad (`ExpressAdapter.ts`)
- **UI**: Como mostramos la informacion al usuario (`App.tsx`)

## Ventajas

- **Testeable**: Puedes testear la logica de negocio sin necesidad de DB o HTTP
- **Independiente**: El dominio no depende de frameworks o librerias externas
- **Flexible**: Puedes cambiar Express por Fastify, o React por Vue sin tocar el dominio
- **Mantenible**: Separacion clara de responsabilidades

## 📊 Diagrama de Arquitectura

Para ver los **diagramas visuales completos** de la arquitectura hexagonal, incluyendo el flujo de datos y las decisiones arquitectonicas, consulta:

**[📖 ARQUITECTURA.md](./ARQUITECTURA.md)**

Este documento incluye:
- Diagrama de componentes con Mermaid
- Diagrama de flujo de datos (secuencia)
- Explicacion detallada de cada capa
- Decisiones arquitectonicas y sus beneficios
- Guia para extender la arquitectura
- Comparacion con arquitecturas tradicionales

## Estructura del Proyecto

```
hexagonal-todo-example/
├── backend/
│   └── src/
│       ├── domain/              # Logica de negocio
│       │   ├── entities/        # Entidades del dominio
│       │   │   └── Task.ts
│       │   ├── ports/           # Interfaces
│       │   │   └── TaskRepository.ts
│       │   └── useCases/        # Casos de uso
│       │       ├── CreateTask.ts
│       │       └── GetAllTasks.ts
│       ├── adapters/            # Implementaciones
│       │   ├── repositories/    # Almacenamiento
│       │   │   └── InMemoryTaskRepository.ts
│       │   └── http/            # API REST
│       │       └── ExpressAdapter.ts
│       └── index.ts             # Dependency Injection
│
└── frontend/
    └── src/
        ├── domain/              # Logica de negocio
        │   ├── entities/
        │   │   └── Task.ts
        │   ├── ports/
        │   │   └── TaskRepository.ts
        │   └── useCases/
        │       ├── CreateTask.ts
        │       └── GetAllTasks.ts
        ├── adapters/            # Implementaciones
        │   ├── repositories/    # Cliente HTTP
        │   │   └── HttpTaskRepository.ts
        │   └── ui/              # Componentes React
        │       ├── App.tsx
        │       └── App.css
        └── main.tsx
```

## Como Ejecutar

Este proyecto usa **pnpm workspaces** para gestionar el monorepo.

### Opcion 1: Ejecutar ambos proyectos simultaneamente (Recomendado)

Desde la raiz del proyecto:

```bash
cd hexagonal-todo-example
pnpm install        # Instala dependencias de ambos proyectos
pnpm dev           # Ejecuta backend y frontend en paralelo
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

### Opcion 2: Ejecutar proyectos individualmente

Desde la raiz del proyecto:

```bash
# Solo backend
pnpm dev:backend

# Solo frontend
pnpm dev:frontend
```

### Opcion 3: Ejecutar desde cada carpeta

```bash
# Backend
cd backend
pnpm dev

# Frontend (en otra terminal)
cd frontend
pnpm dev
```

### Scripts Disponibles

- `pnpm dev` - Ejecuta backend y frontend en paralelo
- `pnpm dev:backend` - Solo backend
- `pnpm dev:frontend` - Solo frontend
- `pnpm build` - Construye ambos proyectos
- `pnpm build:backend` - Solo backend
- `pnpm build:frontend` - Solo frontend

## Endpoints del Backend

- `GET /tasks` - Obtener todas las tareas
- `POST /tasks` - Crear una nueva tarea
  ```json
  {
    "title": "Mi nueva tarea"
  }
  ```

## Flujo de Datos

### Creando una Tarea (Frontend)

```
Usuario escribe en input
    ↓
App.tsx (UI Adapter) llama a CreateTask use case
    ↓
CreateTask (Domain) valida y llama al TaskRepository port
    ↓
HttpTaskRepository (Adapter) hace fetch al backend
    ↓
Backend recibe la peticion
```

### Creando una Tarea (Backend)

```
ExpressAdapter (HTTP) recibe POST /tasks
    ↓
Llama a CreateTask use case
    ↓
CreateTask (Domain) crea entidad Task y llama al TaskRepository port
    ↓
InMemoryTaskRepository (Adapter) guarda en memoria
    ↓
Retorna la Task creada
```

## Conceptos Clave

1. **Inversion de Dependencias**: El dominio define interfaces (ports) y los adapters las implementan
2. **Separation of Concerns**: Cada capa tiene su responsabilidad clara
3. **Dependency Injection**: Las dependencias se inyectan desde el entry point (`index.ts`, `main.tsx`)
4. **Framework Independence**: El dominio no conoce Express, React, o cualquier framework

## Ejercicios para Practicar

1. Agrega un nuevo caso de uso: `CompleteTask` que marque una tarea como completada
2. Cambia `InMemoryTaskRepository` por una implementacion con `localStorage`
3. Agrega validaciones mas complejas en la entidad `Task`
4. Crea un nuevo adapter HTTP usando Fastify en lugar de Express
5. Agrega tests unitarios para los use cases (no necesitan HTTP ni DB!)

## Recursos Adicionales

- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
