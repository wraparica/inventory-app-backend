import { Router } from 'express';
import { register, login, getCurrentUser, logout, refresh } from '../controllers/inventoryControllers.js';
import { uom, getUOM, editUOM, removeUOM } from '../controllers/uomController.js';
import { category, getCategories, editCategory, removeCategory } from '../controllers/categoryController.js';
import { authenticate } from "../middleware/authentication.js";

const router = Router();

router.post('/register', register)

router.post('/login', login)

router.get('/me', authenticate, getCurrentUser)

router.post('/logout', logout)

router.post("/refresh", refresh);

router.post("/uom", authenticate, uom);

router.get("/uom", authenticate, getUOM);

router.put("/uom/:id", authenticate, editUOM);

router.delete("/uom/:id", authenticate, removeUOM);

router.post("/category", authenticate, category);

router.get("/category", authenticate, getCategories);

router.put("/category/:id", authenticate, editCategory);

router.delete("/category/:id", authenticate, removeCategory);

export default router;