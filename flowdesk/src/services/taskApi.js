const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error('Não foi possível conectar à API');
  }

  const data = await response.json();

  // O fetch não lança erro em respostas 400 ou 404: é preciso conferir response.ok.
  if (!response.ok) {
    const details = data.error.details?.map((detail) => detail.message).join('; ');
    throw new Error(details ?? data.error.message);
  }

  return data;
}

export function listTasks() {
  return request('/tasks');
}

export function createTask(taskData) {
  return request('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(id, changes) {
  const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!response.ok) throw new Error('Não foi possível atualizar a tarefa');
  return response.json();
}
