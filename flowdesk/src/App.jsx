import { useEffect, useState } from 'react'
import './App.css'
import ProjectHeader from './components/ProjectHeader';
import TaskCard from './components/TaskCard';
import TaskColumn from './components/TaskColumn';
import { listTasks } from './services/taskApi';

const STATUSES = ['A fazer', 'Em andamento', 'Em revisão', 'Concluído'];

function App() {

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Carregar as informações quando o meu app renderizar
  useEffect(() => {
    listTasks()
      .then(setTasks)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false))
  }, []);

  function handleComplete(taskId) {
    console.log('Tarefa Concluída:', taskId);
  }

  return (
    <main className='app'>
      <ProjectHeader />

      {isLoading && <p>Carregando tarefas ...</p>}
      {error && <p role='alert'>{error}</p>}
      {STATUSES.map((status) => (
          <TaskColumn key={status} title={status}/>
      ))}
    
    </main >
  );
}

export default App
