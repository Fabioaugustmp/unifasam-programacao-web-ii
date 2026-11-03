import { useEffect, useState } from 'react'
import './App.css'
import ProjectHeader from './components/ProjectHeader';
import TaskCard from './components/TaskCard';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';
import { TASK_STATUSES } from './constants/task';
import { createTask, listTasks } from './services/taskApi';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isIgnored = false;

    listTasks()
      .then((loadedTasks) => {
        if (!isIgnored) setTasks(loadedTasks);
      })
      .catch((requestError) => {
        if (!isIgnored) setError(requestError.message);
      })
      .finally(() => {
        if (!isIgnored) setIsLoading(false);
      });

    return () => {
      isIgnored = true;
    };
  }, []);

  async function handleCreate(taskData) {
    const createdTask = await createTask(taskData);
    setTasks((currentTasks) => [...currentTasks, createdTask]);
  }

  function handleComplete(taskId) {
    console.log('Tarefa Concluída:', taskId);
  }

  return (
    <main className='app'>
      <ProjectHeader />
      <TaskForm onCreate={handleCreate} />
      {isLoading && <p>Carregando tarefas...</p>}
      {error && <p role="alert">{error}</p>}
      {TASK_STATUSES.map((status) => (
        <TaskColumn key={status} title={status}>
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                assignee={task.assignee}
                priority={task.priority}
                completed={task.status === 'Concluído'}
                onComplete={handleComplete}
              />
            ))}
        </TaskColumn>
      ))}
    </main >
  );
}

export default App
