import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/inventoryControllers.js';
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.post('/register', register)

router.post('/login', login)

router.post('/me', authenticate, getCurrentUser)

export default router;