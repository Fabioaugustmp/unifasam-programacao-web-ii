import { pool } from '../config/database.js';

// Único arquivo que conhece o banco de dados. Os services e controllers trabalham
// só com objetos em camelCase; aqui fazemos a tradução para as colunas em snake_case.

// Mapeia nomes do modelo da API para as colunas da tabela. Só estas colunas podem ser alteradas.
const UPDATABLE_COLUMNS = {
  title: 'title',
  description: 'description',
  assignee: 'assignee',
  priority: 'priority',
  status: 'status',
};

function toTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    assignee: row.assignee ?? '',
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

// Escapa os caracteres especiais do LIKE, para que o texto buscado seja tratado literalmente.
function escapeLike(text) {
  return text.replace(/[\\%_]/g, (character) => `\\${character}`);
}

export async function findAll({ status, priority, assignee, search } = {}) {
  // Cada filtro vira uma condição com "?" e um valor separado: o valor nunca entra no texto do SQL.
  const conditions = [];
  const values = [];

  if (status) {
    conditions.push('status = ?');
    values.push(status);
  }
  if (priority) {
    conditions.push('priority = ?');
    values.push(priority);
  }
  if (assignee) {
    conditions.push('assignee = ?');
    values.push(assignee);
  }
  if (search) {
    conditions.push('(title LIKE ? OR description LIKE ?)');
    const pattern = `%${escapeLike(search)}%`;
    values.push(pattern, pattern);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT * FROM tasks ${whereClause} ORDER BY id`,
    values,
  );
  return rows.map(toTask);
}

export async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows.length > 0 ? toTask(rows[0]) : null;
}

export async function create(taskData) {
  const [result] = await pool.execute(
    'INSERT INTO tasks (title, description, assignee, priority, status) VALUES (?, ?, ?, ?, ?)',
    [taskData.title, taskData.description, taskData.assignee, taskData.priority, taskData.status],
  );
  return findById(result.insertId);
}

export async function update(id, changes) {
  // Monta o SET apenas com os campos permitidos. id, created_at e updated_at nunca entram aqui.
  const assignments = [];
  const values = [];

  for (const [field, value] of Object.entries(changes)) {
    const column = UPDATABLE_COLUMNS[field];
    if (!column) continue;
    assignments.push(`${column} = ?`);
    values.push(value);
  }

  if (assignments.length > 0) {
    await pool.execute(
      `UPDATE tasks SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id],
    );
  }

  // Busca de novo para devolver o registro como está no banco; se não existir, retorna null.
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
