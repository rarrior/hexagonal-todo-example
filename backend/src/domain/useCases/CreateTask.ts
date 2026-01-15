// Use Case - Application logic
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/ports/TaskRepository';

export class CreateTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(title: string, completed?: boolean): Promise<Task> {
    const id = Date.now().toString();
    const task = Task.create(id, title, completed);
    await this.taskRepository.save(task);
    return task;
  }
}
