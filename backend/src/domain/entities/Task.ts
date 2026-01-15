// Domain Entity - Pure business logic
export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly completed: boolean = false
  ) {}

  complete(): Task {
    return new Task(this.id, this.title, true);
  }

  static create(id: string, title: string, completed?: boolean): Task {
    if (!title.trim()) {
      throw new Error('Task title cannot be empty');
    }
    return new Task(id, title, completed || false);
  }
}
