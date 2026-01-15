// Adapter - HTTP implementation of TaskRepository
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/ports/TaskRepository';

export class HttpTaskRepository implements TaskRepository {
  constructor(private baseUrl: string) {}

  async getAll(): Promise<Task[]> {
    const response = await fetch(`${this.baseUrl}/tasks`);
    const data = await response.json();
    return data.map((task: any) => Task.fromJSON(task));
  }

  async create(title: string): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed: false }),
    });
    const data = await response.json();
    return Task.fromJSON(data);
  }
}
