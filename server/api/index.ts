import express from 'express';

import authRoutes from '../routes/auth.route'
import adminRoutes from '../routes/admin.route'
import { isAuth } from '../middlewares/auth/checkIsAuth';
import { authorizationRoles } from '../constants/auth';
import { customRoles } from '../middlewares/auth/customRole';
import { adminAddUserController } from '../controllers/admin.controller';
import uploadRoutes from '../routes/upload.route';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/upload',uploadRoutes );
export default router;




