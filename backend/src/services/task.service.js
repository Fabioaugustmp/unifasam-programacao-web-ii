import { AppError } from '../errors/app-error.js';
import * as taskRepository from '../repositories/task.repository.js';

function taskNotFoundError(id) {
  return new AppError(404, 'NOT_FOUND', `Tarefa ${id} não encontrada`);
}

export function listTasks(filters) {
  return taskRepository.findAll(filters);
}

export async function getTaskById(id) {
  const task = await taskRepository.findById(id);
  if (!task) throw taskNotFoundError(id);
  return task;
}

// created_at e updated_at são preenchidos pelo próprio banco de dados.
export function createTask(taskData) {
  return taskRepository.create(taskData);
}

export async function updateTask(id, changes) {
  const task = await taskRepository.update(id, changes);
  if (!task) throw taskNotFoundError(id);
  return task;
}

export async function deleteTask(id) {
  const wasDeleted = await taskRepository.remove(id);
  if (!wasDeleted) throw taskNotFoundError(id);
}
