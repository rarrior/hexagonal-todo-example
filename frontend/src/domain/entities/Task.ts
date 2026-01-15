// Domain Entity - Same as backend
export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly completed: boolean = false
  ) {}

  static fromJSON(json: any): Task {
    return new Task(json.id, json.title, json.completed);
  }
}
