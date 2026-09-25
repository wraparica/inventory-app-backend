import { Router } from 'express';
import { register, login } from '../controllers/inventoryControllers.js';
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.post('/register', register)

router.post('/login', login)

export default router;