import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const envFilePath = fileURLToPath(new URL('../../.env', import.meta.url));

// O arquivo .env é opcional: em produção, as variáveis costumam vir do ambiente.
if (existsSync(envFilePath)) {
  process.loadEnvFile(envFilePath);
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  // Sem NODE_ENV definido, assume produção para nunca expor detalhes internos por engano.
  nodeEnv: process.env.NODE_ENV || 'production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
