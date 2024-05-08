import {Router} from 'express';
import { login, logout, authMiddleware } from '../controller/auth/authController.js';

/**
 * This is the route for login
 * POST /api/v1/login
 */

const router = Router();

router.post('/login', login);

/**
 * This the route for logout
 * POST /api/v1/logout
 */

router.post('/logout', authMiddleware, logout);

export default router;
