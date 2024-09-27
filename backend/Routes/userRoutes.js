import express from 'express';
import { followUnfollowUser, frrezeUser, getSuggestedUsers, getUser, loginUser, logoutUser, signupUser, updateUser } from '../Controller/userController.js';
import { protectRoute } from '../Middlewares/protectRoute.js';

const router = express.Router();

router.get('/suggested', protectRoute ,getSuggestedUsers);

router.get('/profile/:query', getUser);

router.post('/signup', signupUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.post('/follow/:id', protectRoute, followUnfollowUser);

router.put('/update/:id', protectRoute, updateUser);

router.put('/freeze', protectRoute, frrezeUser);

export default router;