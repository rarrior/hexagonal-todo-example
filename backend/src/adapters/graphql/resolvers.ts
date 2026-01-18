// GraphQL Resolvers - Adapter that connects GraphQL to Use Cases
import { CreateTask } from '@/domain/useCases/CreateTask';
import { GetAllTasks } from '@/domain/useCases/GetAllTasks';
import { TaskRepository } from '@/domain/ports/TaskRepository';

interface CreateTaskInput {
  title: string;
  completed?: boolean;
}

// Factory function to create resolvers with injected dependencies
export const createResolvers = (
  createTask: CreateTask,
  getAllTasks: GetAllTasks,
  taskRepository: TaskRepository
) => ({
  Query: {
    tasks: async () => {
      return getAllTasks.execute();
    },
    task: async (_: unknown, { id }: { id: string }) => {
      return taskRepository.findById(id);
    },
  },
  Mutation: {
    createTask: async (_: unknown, { input }: { input: CreateTaskInput }) => {
      return createTask.execute(input.title, input.completed);
    },
  },
});
