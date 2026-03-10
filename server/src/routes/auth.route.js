import {login, signup} from "../controllers/auth.controller.js"
import { googleAuth, googleCallback } from "../controllers/oAuth.controller.js";
import {Router} from 'express';
const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;