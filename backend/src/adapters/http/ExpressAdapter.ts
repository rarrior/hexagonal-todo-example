// Adapter - HTTP Server using Express (REST endpoints)
import { Application, Request, Response } from 'express';
import { CreateTask } from '@/domain/useCases/CreateTask';
import { GetAllTasks } from '@/domain/useCases/GetAllTasks';

export class ExpressAdapter {
  constructor(
    private createTask: CreateTask,
    private getAllTasks: GetAllTasks
  ) {}

  setupRoutes(app: Application) {
    app.get('/tasks', async (req: Request, res: Response) => {
      try {
        const tasks = await this.getAllTasks.execute();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
      }
    });

    app.post('/tasks', async (req: Request, res: Response) => {
      try {
        const { title, completed } = req.body;
        const task = await this.createTask.execute(title, completed);
        res.status(201).json(task);
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    });

    console.log('REST endpoints ready at /tasks');
  }
}
