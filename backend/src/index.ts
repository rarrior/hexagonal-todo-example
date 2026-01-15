// Application Entry Point - Dependency Injection
import { InMemoryTaskRepository } from '@/adapters/repositories/InMemoryTaskRepository';
import { ExpressAdapter } from '@/adapters/http/ExpressAdapter';
import { CreateTask } from '@/domain/useCases/CreateTask';
import { GetAllTasks } from '@/domain/useCases/GetAllTasks';

// Create instances (Dependency Injection)
const taskRepository = new InMemoryTaskRepository();
const createTask = new CreateTask(taskRepository);
const getAllTasks = new GetAllTasks(taskRepository);

// Start HTTP Adapter
const httpAdapter = new ExpressAdapter(createTask, getAllTasks);
httpAdapter.start(3000);
