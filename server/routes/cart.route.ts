import express from 'express';
import { isAuth } from '../middlewares/auth/checkIsAuth';
import { addToCartController, createCartController, decreaseItemCartController, getCartController } from '../controllers/cart.controller';


const router = express.Router();


router.post('/carts', isAuth, createCartController)
router.post('/:cartId/add-cart', isAuth, addToCartController);
router.post('/:cartId/remove-item-cart', isAuth, decreaseItemCartController );
router.get('/', isAuth, getCartController);
const b = null;
export default router;