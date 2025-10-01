import { Router } from 'express';
import { body, param } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = Router();

router.use(authRequired);

router.get('/', listTasks);

router.post(
  '/',
  [body('title').notEmpty().withMessage('Title required')],
  createTask
);

router.get('/:id', [param('id').isMongoId()], getTask);

router.put(
  '/:id',
  [param('id').isMongoId()],
  updateTask
);

router.delete('/:id', [param('id').isMongoId()], deleteTask);

export default router;
