import app from './app.js';
import { pool, checkDatabaseConnection } from './config/database.js';
import { env } from './config/env.js';

// Não subimos o servidor sem banco: uma API "de pé" que falha em todas as consultas confunde mais do que ajuda.
async function start() {
  try {
    await checkDatabaseConnection();
  } catch (error) {
    console.error(`Não foi possível conectar ao MySQL em ${env.db.host}:${env.db.port}/${env.db.name}.`);
    console.error(`Motivo: ${error.code ?? error.message}`);
    console.error('Confira as variáveis DB_* no arquivo backend/.env e se o serviço MySQL está em execução.');
    await pool.end();
    process.exit(1);
  }

  app.listen(env.port, (error) => {
    if (error) {
      console.error(`Não foi possível iniciar o servidor: ${error.message}`);
      process.exit(1);
    }

    console.log(`FlowDesk API em http://localhost:${env.port}/api (${env.nodeEnv})`);
    console.log(`Banco de dados: ${env.db.name} em ${env.db.host}:${env.db.port}`);
  });
}

start();
