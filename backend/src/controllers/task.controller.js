import {
  createTaskSchema,
  taskFiltersSchema,
  updateTaskSchema,
} from '../schemas/task.schema.js';
import * as taskService from '../services/task.service.js';

// O Express 5 encaminha ao middleware de erros qualquer erro lançado nestas funções.

export async function listTasks(req, res) {
  const filters = taskFiltersSchema.parse(req.query);
  res.json(await taskService.listTasks(filters));
}

export async function getTaskById(req, res) {
  res.json(await taskService.getTaskById(req.params.id));
}

export async function createTask(req, res) {
  const taskData = createTaskSchema.parse(req.body);
  res.status(201).json(await taskService.createTask(taskData));
}

export async function updateTask(req, res) {
  const changes = updateTaskSchema.parse(req.body);
  res.json(await taskService.updateTask(req.params.id, changes));
}

export async function deleteTask(req, res) {
  await taskService.deleteTask(req.params.id);
  res.status(204).end();
}
