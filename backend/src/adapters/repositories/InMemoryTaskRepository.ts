// Adapter - Concrete implementation of TaskRepository port
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/ports/TaskRepository';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Map<string, Task> = new Map();

  async save(task: Task): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }
}
