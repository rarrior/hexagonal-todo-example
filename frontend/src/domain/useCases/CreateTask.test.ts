import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTask } from './CreateTask';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/ports/TaskRepository';

describe('CreateTask Use Case', () => {
  let createTask: CreateTask;
  let mockRepository: TaskRepository;

  beforeEach(() => {
    mockRepository = {
      getAll: vi.fn(),
      create: vi.fn(),
    };
    createTask = new CreateTask(mockRepository);
  });

  it('should create a task with valid title', async () => {
    const expectedTask = new Task('1', 'New task', false);
    vi.mocked(mockRepository.create).mockResolvedValue(expectedTask);

    const result = await createTask.execute('New task');

    expect(mockRepository.create).toHaveBeenCalledWith('New task');
    expect(result).toBe(expectedTask);
  });

  it('should throw error when title is empty', async () => {
    await expect(createTask.execute('')).rejects.toThrow(
      'Task title cannot be empty'
    );
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when title contains only whitespace', async () => {
    await expect(createTask.execute('   ')).rejects.toThrow(
      'Task title cannot be empty'
    );
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should trim title before validation but pass original to repository', async () => {
    const expectedTask = new Task('1', '  Valid task  ', false);
    vi.mocked(mockRepository.create).mockResolvedValue(expectedTask);

    await createTask.execute('  Valid task  ');

    expect(mockRepository.create).toHaveBeenCalledWith('  Valid task  ');
  });

  it('should propagate repository errors', async () => {
    vi.mocked(mockRepository.create).mockRejectedValue(
      new Error('Network error')
    );

    await expect(createTask.execute('Task')).rejects.toThrow('Network error');
  });
});
