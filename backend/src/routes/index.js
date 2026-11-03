import { Router } from 'express';
import taskRoutes from './task.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'UP', application: 'FlowDesk API' });
});

router.use('/tasks', taskRoutes);

export default router;
