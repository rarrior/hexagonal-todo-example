// Port - Interface for task data access
import { Task } from '@/domain/entities/Task';

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(title: string): Promise<Task>;
}
