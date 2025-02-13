import express from "express";
import {
  getAuthProfileController,
  loginController,
  logoutController,
  signupController,
  testController,
  updateController,
} from "../controllers/auth.controller";
import { isAuth } from "../middlewares/auth/checkIsAuth";
import {
  logoutService,
  sendCodeResetPasswordService,
  updatePasswordWithEmailService,
  verifyCodeResetPasswordService,
} from "../services/auth.service";
import { get } from "mongoose";
import { verify } from "crypto";

const router = express.Router();



router.post("/signup", signupController);
router.post("/login", loginController);
// router.post('/login', loginController);
router.get("/test", isAuth, testController);
router.put("/update", isAuth, updateController);
router.post("/logout", isAuth, logoutController);
// router.post('/refresh-token', refreshTokenController);
router.get("/me", isAuth, getAuthProfileController);
router.post("/sendCodeResetPassword",sendCodeResetPasswordService);
router.post("/verifyCodeResetPassword",verifyCodeResetPasswordService);
router.post("/updatePasswordWithEmail", updatePasswordWithEmailService);
export default router;
