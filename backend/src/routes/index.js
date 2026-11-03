import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from '../docs/openapi.js';
import taskRoutes from './task.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'UP', application: 'FlowDesk API' });
});

router.use('/tasks', taskRoutes);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default router;
