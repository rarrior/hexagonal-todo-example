// Port - Interface that defines how to interact with tasks storage
import { Task } from '@/domain/entities/Task';

export interface TaskRepository {
  save(task: Task): Promise<void>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
}
