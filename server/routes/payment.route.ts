import express from 'express';
import { isAuth } from '../middlewares/auth/checkIsAuth';
import { createOrderService, getPaymentInfo } from '../services/payment.service';

const router = express.Router();


router.post('/create',isAuth, createOrderService);
router.get('/getPaymentInfo/:orderCode',isAuth, getPaymentInfo);

export default router;