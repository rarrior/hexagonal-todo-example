import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAllTasks } from './GetAllTasks';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/ports/TaskRepository';

describe('GetAllTasks Use Case', () => {
  let getAllTasks: GetAllTasks;
  let mockRepository: TaskRepository;

  beforeEach(() => {
    mockRepository = {
      getAll: vi.fn(),
      create: vi.fn(),
    };
    getAllTasks = new GetAllTasks(mockRepository);
  });

  it('should return all tasks from repository', async () => {
    const expectedTasks = [
      new Task('1', 'Task 1', false),
      new Task('2', 'Task 2', true),
    ];
    vi.mocked(mockRepository.getAll).mockResolvedValue(expectedTasks);

    const result = await getAllTasks.execute();

    expect(mockRepository.getAll).toHaveBeenCalledOnce();
    expect(result).toEqual(expectedTasks);
  });

  it('should return empty array when no tasks exist', async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([]);

    const result = await getAllTasks.execute();

    expect(result).toEqual([]);
  });

  it('should propagate repository errors', async () => {
    vi.mocked(mockRepository.getAll).mockRejectedValue(
      new Error('Connection failed')
    );

    await expect(getAllTasks.execute()).rejects.toThrow('Connection failed');
  });

  it('should return tasks in the same order as repository', async () => {
    const tasks = [
      new Task('3', 'Third', false),
      new Task('1', 'First', true),
      new Task('2', 'Second', false),
    ];
    vi.mocked(mockRepository.getAll).mockResolvedValue(tasks);

    const result = await getAllTasks.execute();

    expect(result[0].id).toBe('3');
    expect(result[1].id).toBe('1');
    expect(result[2].id).toBe('2');
  });
});
