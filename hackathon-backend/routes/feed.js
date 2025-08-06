import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import { toggleLike, getFeed } from '../controllers/feed.js';

const router = express.Router();

router.put('/like', verifyJWT, toggleLike)
router.get('/:id', verifyJWT, getFeed);

export default router;