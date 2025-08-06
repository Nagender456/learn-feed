import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import { getFeeds, createFeed } from '../controllers/feeds.js';

const router = express.Router();

router.route('/')
	.get(verifyJWT, getFeeds)
	.post(verifyJWT, createFeed)

export default router;