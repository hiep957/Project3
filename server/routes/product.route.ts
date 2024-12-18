import express from "express";
import {
  getProductController,
  getProductsController,
} from "../controllers/product.controller";
import { ChangeProductQuantityAfterPayment } from "../services/product.service";
import { isAuth } from "../middlewares/auth/checkIsAuth";

const router = express.Router();

router.get("/:productId", getProductController);

router.get("/", getProductsController);

router.post("/decreaseItemAfterPayment/:orderCode",isAuth, ChangeProductQuantityAfterPayment);
export default router;
