import express from 'express';
import { isAuth } from '../middlewares/auth/checkIsAuth';
import { addToCartController, createCartController } from '../controllers/cart.controller';


const router = express.Router();


router.post('/carts', isAuth, createCartController)
router.post('/:cartId/add-cart', isAuth, addToCartController);

export default router;