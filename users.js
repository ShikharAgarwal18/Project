import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { body } from 'express-validator';

const router = Router();

router.get('/me', authRequired, getProfile);

router.put(
  '/me',
  authRequired,
  [
    body('name').optional().isString().isLength({ min: 1 }),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
  ],
  updateProfile
);

export default router;
