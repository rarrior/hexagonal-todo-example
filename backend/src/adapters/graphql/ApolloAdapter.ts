// Adapter - GraphQL Server using Apollo
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { Application } from 'express';
import { typeDefs } from './schema';
import { createResolvers } from './resolvers';
import { CreateTask } from '@/domain/useCases/CreateTask';
import { GetAllTasks } from '@/domain/useCases/GetAllTasks';
import { TaskRepository } from '@/domain/ports/TaskRepository';

export class ApolloAdapter {
  private server: ApolloServer;

  constructor(
    private createTask: CreateTask,
    private getAllTasks: GetAllTasks,
    private taskRepository: TaskRepository
  ) {
    const resolvers = createResolvers(createTask, getAllTasks, taskRepository);
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
    });
  }

  async applyMiddleware(app: Application): Promise<void> {
    await this.server.start();

    app.use('/graphql', expressMiddleware(this.server));

    console.log('GraphQL endpoint ready at /graphql');
  }
}
