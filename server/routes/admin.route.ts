import express from "express";
import { customRoles } from "../middlewares/auth/customRole";
import { isAuth } from "../middlewares/auth/checkIsAuth";
import { authorizationRoles } from "../constants/auth";
import {
  adminAddCategoryController,
  adminAddProductController,
  adminAddUserController,
  adminDeleteCategoryController,
  adminGetCategoriesController,
  adminUpdateCategoryController,
  adminUpdateProductController,
  adminUpdateUserController,
  getCategoriesController,
} from "../controllers/admin.controller";
import dotenv from "dotenv";
import { Admin } from "mongodb";
import multer from "multer";
import cloudinary from "cloudinary";
import { get } from "mongoose";
import {
  getCategoryAndCountProductService,
  getTotalUsersService,
} from "../services/auth.service";
import {
  getAllUserServices,
  getOrderInDecemberService,
  getOrderThisYearService,
  getUserOrderService,
} from "../services/admin.service";
dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});
router.post(
  "/users/add",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  adminAddUserController
);
router.put(
  "/users/update/:userId",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  adminUpdateUserController
);

router.get("/categories", getCategoriesController);

router.post(
  "/categories/add",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  adminAddCategoryController
);
router.put(
  "/categories/update/:categoryId",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  adminUpdateCategoryController
);
router.delete(
  "/categories/delete/:categoryId",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  adminDeleteCategoryController
);
router.get(
  "/categories",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  adminGetCategoriesController
);

router.post(
  "/products/add",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  adminAddProductController
);

router.put(
  "/products/update/:productId",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  adminUpdateProductController
);

router.get(
  "/totalUser",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  getTotalUsersService
);

router.get(
  "/totalCategoryAndProduct",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  getCategoryAndCountProductService
);

router.get(
  "/getOrderThisYear",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  getOrderThisYearService
);

router.get(
  "/getOrderDecember",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  getOrderInDecemberService
);

router.post(
  "/getAllUser",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  getAllUserServices
);

router.post(
  "/getAllOrder",
  isAuth,
  customRoles(process.env.ADMIN_EMAIL, authorizationRoles.admin),
  getUserOrderService
);
export = router;
