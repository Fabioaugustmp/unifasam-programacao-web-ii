import { seedTasks } from '../data/seed.js';

// Único arquivo que conhece o armazenamento. Para usar SQLite ou PostgreSQL,
// basta reescrever estas funções mantendo os mesmos nomes e retornos.
// Elas já são async porque as consultas a um banco de dados também serão.

const tasks = seedTasks.map((task) => ({ ...task }));

// O contador só cresce: o ID de uma tarefa excluída nunca é reutilizado.
let nextIdNumber = 1 + Math.max(...tasks.map((task) => Number(task.id.replace('FD-', ''))));

function includesText(text, searchedText) {
  return text.toLowerCase().includes(searchedText.toLowerCase());
}

export async function findAll({ status, priority, assignee, search } = {}) {
  const foundTasks = tasks.filter((task) => {
    if (status && task.status !== status) return false;
    if (priority && task.priority !== priority) return false;
    if (assignee && task.assignee.toLowerCase() !== assignee.toLowerCase()) return false;
    if (search && !includesText(task.title, search) && !includesText(task.description, search)) {
      return false;
    }
    return true;
  });

  // Retorna cópias para que nenhuma outra camada altere os dados armazenados.
  return foundTasks.map((task) => ({ ...task }));
}

export async function findById(id) {
  const task = tasks.find((currentTask) => currentTask.id === id);
  return task ? { ...task } : null;
}

export async function create(taskData) {
  const task = { id: `FD-${nextIdNumber}`, ...taskData };
  nextIdNumber += 1;
  tasks.push(task);
  return { ...task };
}

export async function update(id, changes) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...changes };
  return { ...tasks[index] };
}

export async function remove(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}
