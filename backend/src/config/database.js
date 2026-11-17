import mysql from 'mysql2/promise';
import { env } from './env.js';

// Um pool mantém várias conexões abertas e reutiliza uma delas a cada consulta,
// em vez de abrir e fechar uma conexão nova para cada requisição.
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Lê e grava TIMESTAMP em UTC, para que as datas virem o formato ISO corretamente na API.
  timezone: 'Z',
});

// Executa uma consulta simples. Se o banco estiver fora do ar, a exceção sobe para quem chamou.
export async function checkDatabaseConnection() {
  await pool.execute('SELECT 1');
}
