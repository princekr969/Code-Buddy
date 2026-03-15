import { verifyToken } from '../middleware/auth.middleware.js';
import {getCurrentUser, getUserById} from '../controllers/user.controller.js'
import {Router} from 'express';
const router = Router();

router.get("/me", verifyToken, getCurrentUser);
router.get("/:id", verifyToken, getUserById);

export default router;