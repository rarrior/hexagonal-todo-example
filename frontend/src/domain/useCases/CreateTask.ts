// Use Case - Application logic
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/ports/TaskRepository';

export class CreateTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(title: string): Promise<Task> {
    if (!title.trim()) {
      throw new Error('Task title cannot be empty');
    }
    return this.taskRepository.create(title);
  }
}
