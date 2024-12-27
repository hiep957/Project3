import express from 'express';
import { isAuth } from '../middlewares/auth/checkIsAuth';
import { addToCartController, createCartController, decreaseItemCartController, getCartController } from '../controllers/cart.controller';
import { removeCartItemAfterPaymentService } from '../services/cart.service';


const router = express.Router();

router.get('/', isAuth, getCartController);
router.post('/create-cart', isAuth, createCartController)
router.post('/add-cart', isAuth, addToCartController);
router.post('/remove-item-cart', isAuth, decreaseItemCartController );
router.delete('/deleteAfterPayment/:orderCode', isAuth, removeCartItemAfterPaymentService);
const b = null;
export default router;