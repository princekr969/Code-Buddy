import {Router} from 'express';
import {executeCode, getSupportedLanguages} from "../controllers/execute.controller.js";
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post("/execute",[],verifyToken, executeCode);

router.get("/languages",verifyToken, getSupportedLanguages);

export default router;