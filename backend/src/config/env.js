import dotenv from 'dotenv';

// Lê o arquivo backend/.env, se existir. Em produção, as variáveis costumam vir do próprio ambiente.
dotenv.config({ path: new URL('../../.env', import.meta.url), quiet: true });

export const env = {
  port: Number(process.env.PORT) || 3000,
  // Sem NODE_ENV definido, assume produção para nunca expor detalhes internos por engano.
  nodeEnv: process.env.NODE_ENV || 'production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'flowdesk',
    user: process.env.DB_USER,
    // A senha pode ser vazia em ambientes locais; o padrão evita que undefined chegue ao driver.
    password: process.env.DB_PASSWORD ?? '',
  },
};
