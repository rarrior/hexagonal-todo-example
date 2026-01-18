// Adapter - Task Repository using GraphQL
import { ApolloClient, gql } from '@apollo/client';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/ports/TaskRepository';

interface TaskData {
  id: string;
  title: string;
  completed: boolean;
}

interface GetAllTasksResponse {
  tasks: TaskData[];
}

interface CreateTaskResponse {
  createTask: TaskData;
}

const GET_ALL_TASKS = gql`
  query GetAllTasks {
    tasks {
      id
      title
      completed
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      completed
    }
  }
`;

export class GraphQLTaskRepository implements TaskRepository {
  constructor(private client: ApolloClient) {}

  async getAll(): Promise<Task[]> {
    const { data } = await this.client.query<GetAllTasksResponse>({
      query: GET_ALL_TASKS,
      fetchPolicy: 'network-only',
    });
    if (!data) {
      return [];
    }
    return data.tasks.map((task) => Task.fromJSON(task));
  }

  async create(title: string): Promise<Task> {
    const { data } = await this.client.mutate<CreateTaskResponse>({
      mutation: CREATE_TASK,
      variables: { input: { title, completed: false } },
    });
    if (!data) {
      throw new Error('Failed to create task');
    }
    return Task.fromJSON(data.createTask);
  }
}
