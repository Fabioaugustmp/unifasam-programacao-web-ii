import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFound } from './middlewares/not-found.js';
import routes from './routes/index.js';

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.use('/api', routes);

// A ordem importa: estes dois middlewares precisam vir depois das rotas.
app.use(notFound);
app.use(errorHandler);

export default app;
