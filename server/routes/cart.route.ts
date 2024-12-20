import express from 'express';
import { isAuth } from '../middlewares/auth/checkIsAuth';
import { addToCartController, createCartController, decreaseItemCartController, getCartController } from '../controllers/cart.controller';
import { removeCartItemAfterPaymentService } from '../services/cart.service';


const router = express.Router();


router.post('/create-cart', isAuth, createCartController)
router.post('/add-cart', isAuth, addToCartController);
router.post('/:cartId/remove-item-cart', isAuth, decreaseItemCartController );
router.get('/', isAuth, getCartController);
router.delete('/deleteAfterPayment/:orderCode', isAuth, removeCartItemAfterPaymentService);
const b = null;
export default router;