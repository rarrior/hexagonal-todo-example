import { describe, it, expect } from 'vitest';
import { Task } from './Task';

describe('Task Entity', () => {
  describe('constructor', () => {
    it('should create a task with given properties', () => {
      const task = new Task('1', 'Test task', false);

      expect(task.id).toBe('1');
      expect(task.title).toBe('Test task');
      expect(task.completed).toBe(false);
    });

    it('should default completed to false', () => {
      const task = new Task('1', 'Test task');

      expect(task.completed).toBe(false);
    });

    it('should create a completed task when specified', () => {
      const task = new Task('1', 'Test task', true);

      expect(task.completed).toBe(true);
    });
  });

  describe('fromJSON', () => {
    it('should create a Task from JSON object', () => {
      const json = { id: '123', title: 'My task', completed: true };

      const task = Task.fromJSON(json);

      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBe('123');
      expect(task.title).toBe('My task');
      expect(task.completed).toBe(true);
    });

    it('should handle JSON without completed field', () => {
      const json = { id: '1', title: 'Task' };

      const task = Task.fromJSON(json);

      expect(task.id).toBe('1');
      expect(task.title).toBe('Task');
      expect(task.completed).toBe(false);
    });
  });
});
