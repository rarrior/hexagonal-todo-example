// Application Entry Point - Dependency Injection
import express from 'express';
import cors from 'cors';
import { InMemoryTaskRepository } from '@/adapters/repositories/InMemoryTaskRepository';
import { ExpressAdapter } from '@/adapters/http/ExpressAdapter';
import { ApolloAdapter } from '@/adapters/graphql/ApolloAdapter';
import { CreateTask } from '@/domain/useCases/CreateTask';
import { GetAllTasks } from '@/domain/useCases/GetAllTasks';

async function bootstrap() {
  // Create shared instances (Dependency Injection)
  const taskRepository = new InMemoryTaskRepository();
  const createTask = new CreateTask(taskRepository);
  const getAllTasks = new GetAllTasks(taskRepository);

  // Create Express app with shared middleware
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Setup REST Adapter (endpoints at /tasks)
  const restAdapter = new ExpressAdapter(createTask, getAllTasks);
  restAdapter.setupRoutes(app);

  // Setup GraphQL Adapter (endpoint at /graphql)
  const graphqlAdapter = new ApolloAdapter(createTask, getAllTasks, taskRepository);
  await graphqlAdapter.applyMiddleware(app);

  // Start server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`REST API:  http://localhost:${PORT}/tasks`);
    console.log(`GraphQL:   http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch(console.error);
