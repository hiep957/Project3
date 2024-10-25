
import express from 'express';
import { getProductController, getProductsController } from '../controllers/product.controller';

const router = express.Router();



router.get('/:productId', getProductController);

router.get('/', getProductsController);

export default router;