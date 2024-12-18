import express from 'express';

import authRoutes from '../routes/auth.route'
import adminRoutes from '../routes/admin.route'
import { isAuth } from '../middlewares/auth/checkIsAuth';
import { authorizationRoles } from '../constants/auth';
import { customRoles } from '../middlewares/auth/customRole';
import { adminAddUserController } from '../controllers/admin.controller';
import uploadRoutes from '../routes/upload.route';
import productRoutes from '../routes/product.route';
import cartRoutes from '../routes/cart.route';
import paymentRoutes from '../routes/payment.route';
import vitonRoutes from '../routes/viton.route';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/upload',uploadRoutes );
router.use('/product', productRoutes);
router.use('/cart', cartRoutes);
router.use('/payment', paymentRoutes);
router.use('/viton', vitonRoutes)
// router.use('/webhook', webhookRoutes)
export default router;




