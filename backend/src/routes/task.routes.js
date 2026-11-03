import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';

const router = Router();

router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
