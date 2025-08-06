import express from 'express';
import { userLogin, userRegister, userRefreshToken, userLogout, userProfile, userUpdate, userFollow } from '../controllers/users.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/logout', userLogout);
router.get('/refresh', userRefreshToken);
router.put('/update', verifyJWT, userUpdate);
router.get('/profile/:username', verifyJWT, userProfile);
router.put('/follow', verifyJWT, userFollow);

export default router;