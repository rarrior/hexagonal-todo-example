// UI Adapter - React Component
import { useState, useEffect } from 'react';
import { Task } from '@/domain/entities/Task';
import { CreateTask } from '@/domain/useCases/CreateTask';
import { GetAllTasks } from '@/domain/useCases/GetAllTasks';
import { GraphQLTaskRepository } from '@/adapters/repositories/GraphQLTaskRepository';
import { apolloClient } from '@/adapters/graphql/apolloClient';
import {
  Container,
  Card,
  Header,
  Title,
  Subtitle,
  Content,
  Stats,
  StatCard,
  StatNumber,
  StatLabel,
  Form,
  Input,
  Button,
  ErrorAlert,
  SectionTitle,
  LoadingSpinner,
  EmptyState,
  EmptyIcon,
  TaskList,
  TaskItem,
  TaskContent,
  TaskIcon,
  TaskTitle,
  Badge,
} from './App.styles';

// Dependency Injection - Using GraphQL
const taskRepository = new GraphQLTaskRepository(apolloClient);
const createTaskUseCase = new CreateTask(taskRepository);
const getAllTasksUseCase = new GetAllTasks(taskRepository);

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getAllTasksUseCase.execute();
      setTasks(fetchedTasks);
      setError('');
    } catch (err) {
      setError('Error loading tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createTaskUseCase.execute(newTaskTitle);
      setNewTaskTitle('');
      await loadTasks();
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <Container>
      <Card>
        <Header>
          <Title>TODO List</Title>
          <Subtitle>Hexagonal Architecture Demo</Subtitle>
        </Header>

        <Content>
          {tasks.length > 0 && (
            <Stats>
              <StatCard $variant="pending">
                <StatNumber $variant="pending">{pendingCount}</StatNumber>
                <StatLabel>Pending</StatLabel>
              </StatCard>
              <StatCard $variant="completed">
                <StatNumber $variant="completed">{completedCount}</StatNumber>
                <StatLabel>Completed</StatLabel>
              </StatCard>
            </Stats>
          )}

          <Form onSubmit={handleCreateTask}>
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? '...' : '+ Add'}
            </Button>
          </Form>

          {error && (
            <ErrorAlert>
              <span>!</span>
              {error}
            </ErrorAlert>
          )}

          <SectionTitle>Your Tasks</SectionTitle>

          {loading && tasks.length === 0 ? (
            <LoadingSpinner />
          ) : tasks.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <p>No tasks yet. Create your first one!</p>
            </EmptyState>
          ) : (
            <TaskList>
              {tasks.map((task) => (
                <TaskItem key={task.id} $completed={task.completed}>
                  <TaskContent>
                    <TaskIcon $completed={task.completed}>
                      {task.completed ? '✓' : '○'}
                    </TaskIcon>
                    <TaskTitle $completed={task.completed}>
                      {task.title}
                    </TaskTitle>
                  </TaskContent>
                  <Badge $variant={task.completed ? 'success' : 'warning'}>
                    {task.completed ? 'Done' : 'Pending'}
                  </Badge>
                </TaskItem>
              ))}
            </TaskList>
          )}
        </Content>
      </Card>
    </Container>
  );
}

export default App;
