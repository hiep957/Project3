import express from 'express';
import { getAuthProfileController, loginController, logoutController, refreshTokenController, signupController, testController, updateController } from '../controllers/auth.controller';
import { isAuth } from '../middlewares/auth/checkIsAuth';
import { logoutService } from '../services/auth.service';
import { get } from 'mongoose';



const router = express.Router();



router.post('/signup', signupController);
router.post('/login', loginController);
// router.post('/login', loginController);
router.get("/test", isAuth, testController);
router.put('/update/:userId',isAuth, updateController);
router.post('/logout',isAuth, logoutController);
router.post('/refresh-token', refreshTokenController);
router.get('/me',isAuth, getAuthProfileController);
export default router;