import { Router } from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/inventoryControllers.js';
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.post('/register', register)

router.post('/login', login)

router.get('/me', authenticate, getCurrentUser)

router.post('/logout', logout)

export default router;