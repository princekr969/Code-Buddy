import {login, signup} from "../controllers/auth.controller.js"
import {Router} from 'express';
const router = Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

export default router;