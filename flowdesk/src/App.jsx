import { useState } from 'react'
import './App.css'
import ProjectHeader from './components/ProjectHeader';
import TaskCard from './components/TaskCard';
import TaskColumn from './components/TaskColumn';

function App() {
  return (
    <main className='app'>
      <ProjectHeader />
      <TaskColumn title="A fazer">
        <TaskCard
          title="Criar protótipo"
          assignee="Marina"
          priority="Alta"
        />

        <TaskCard
          title="Revisar interface"
          assignee="Ana"
          priority="Baixa"
        />
      </TaskColumn>
      <TaskColumn title="Em Progresso">
        <TaskCard
          title="Implementar interface"
          assignee="Ana"
          priority="Média"
        />
      </TaskColumn>
      <TaskColumn title="Concluído">
        <TaskCard
          title="Definir identidade visual"
          assignee="Pedro"
          priority="Baixa"
        />
      </TaskColumn>
    </main >
  );
}

export default App
