import app from './app.js';
import { env } from './config/env.js';

// No Express 5, falhas ao abrir a porta (como porta em uso) chegam neste callback.
app.listen(env.port, (error) => {
  if (error) {
    console.error(`Não foi possível iniciar o servidor: ${error.message}`);
    process.exit(1);
  }

  console.log(`FlowDesk API em http://localhost:${env.port}/api (${env.nodeEnv})`);
});
