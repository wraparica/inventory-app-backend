import { Router } from 'express';
import { register, login, getCurrentUser, logout, refresh } from '../controllers/inventoryControllers.js';
import { uom } from '../controllers/uomController.js';
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.post('/register', register)

router.post('/login', login)

router.get('/me', authenticate, getCurrentUser)

router.post('/logout', logout)

router.post("/refresh", refresh);

router.post("/uom", authenticate, uom);

export default router;