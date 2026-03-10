import { verifyToken } from '../middleware/auth.middleware.js';
import {getCurrentUser} from '../controllers/user.controller.js'
import {Router} from 'express';
const router = Router();

router.get("/me", authenticate, getCurrentUser);

export default router;