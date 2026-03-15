import {login, signup, logout, refreshAccessToken} from "../controllers/auth.controller.js"
import { googleAuth, googleCallback } from "../controllers/oAuth.controller.js";
import {Router} from 'express';
const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/logout", logout)
router.post("/refresh", refreshAccessToken);

export default router;