import {Router} from 'express';
import { createRoom, getRoomById, getRoomsById } from '../controllers/room.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
const router = Router();

router.post("/create", verifyToken, createRoom);
router.get("/:roomId", verifyToken, getRoomById);
router.get("/user/rooms/:userId",verifyToken, getRoomsById);

export default router;