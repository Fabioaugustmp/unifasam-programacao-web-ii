import { useState } from 'react'
import './App.css'
import ProjectHeader from './components/ProjectHeader';
import TaskCard from './components/TaskCard';
import TaskColumn from './components/TaskColumn';

function App() {

  function handleComplete(taskId) {
    console.log('Tarefa Concluída:', taskId);
  }

  return (
    <main className='app'>
      <ProjectHeader />
      <TaskColumn title="A fazer">
        <TaskCard
          id="FD-101"
          title="Criar protótipo"
          assignee="Marina"
          priority="Alta"
          onComplete={handleComplete}
        />

        {/* <TaskCard
          title="Revisar interface"
          assignee="Ana"
          priority="Baixa"
        /> */}
      </TaskColumn>
      <TaskColumn title="Em Progresso">
        {/* <TaskCard
          title="Implementar interface"
          assignee="Ana"
          priority="Média"
        /> */}
      </TaskColumn>
      <TaskColumn title="Concluído">
        {/* <TaskCard
          title="Definir identidade visual"
          assignee="Pedro"
          priority="Baixa"
        /> */}
      </TaskColumn>
    </main >
  );
}

export default App
