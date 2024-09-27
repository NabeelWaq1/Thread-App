import express from 'express';
import { getConversations, getMessage, sendMessage } from '../Controller/messageController.js';
import { protectRoute } from '../Middlewares/protectRoute.js';

const router = express.Router();

router.get('/conversations', protectRoute , getConversations)

router.get('/:otherUserId', protectRoute , getMessage)

router.post('/', protectRoute , sendMessage)

export default router;