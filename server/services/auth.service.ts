import { BadRequestError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/User.model";
import TokenModel from "../models/Token.model";
import { SignOptions } from "jsonwebtoken";
import { AuthenticatedRequestBody } from "../interfaces/CustomType";
import { ICartUser, IUser } from "../interfaces/User";
import verifyRefreshToken from "../middlewares/auth/verifyRefreshToken";
import { authorizationRoles } from "../constants/auth";
import Redis from "ioredis";
import nodemailer from "nodemailer";
export const resetPasswordService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  }
);

export const signupService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let role = authorizationRoles.user;
    let emailAdmin = process.env.ADMIN_EMAIL as string[] | undefined;

    if (emailAdmin?.includes(req.body.email)) {
      role = authorizationRoles.admin;
    }
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      throw new BadRequestError("Please fill in all fields required");
    }
    if (password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      throw new BadRequestError(
        "Password and Confirm Password must be the same"
      );
    }
    let user = await UserModel.findOne({ email: email });

    if (user) {
      throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      role,
    });

    const userSaved = await newUser.save();

    let token = await new TokenModel({ userId: userSaved._id });

    const payload = {
      userId: userSaved._id,
    };

    const generatedAccessToken = await token.generateToken(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "1d",
        audience: String(newUser._id),
      }
    );
    const generatedRefreshToken = await token.generateToken(
      { userId: newUser._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
        audience: String(newUser._id),
      }
    );

    token.accessToken = generatedAccessToken;
    token.refreshToken = generatedRefreshToken;

    token = await token.save();

    const data = {
      user: userSaved,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      status: "Registration successful",
      user: newUser,
    });
  }
);

export const loginService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email }).select("+password");

    if (!user) {
      throw new BadRequestError("User Not Found");
    }
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestError("Wrong Password");
    }

    let token = await TokenModel.findOne({ userId: user._id });

    if (!token) {
      token = await new TokenModel({ userId: user._id }).save();
    }

    const generatedAccessToken = await token.generateToken(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "1d",
        audience: String(user._id),
      }
    );
    const generatedRefreshToken = await token.generateToken(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
        audience: String(user._id),
      }
    );

    token.accessToken = generatedAccessToken;
    token.refreshToken = generatedRefreshToken;

    await token.save();

    const data = {
      user,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
    

    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Login successful",
      user: user,
    });
  }
);

export const testService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Test successful");
    return res.status(200).json({
      status: "Test successful",
    });
  }
);

export const updateService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?._id;
    const { name, surname, email, address, phoneNumber, bio, password } =
      req.body;
    const updateFields: any = {};

    if (name !== undefined) {
      updateFields.name = name;
    }
    if (surname !== undefined) {
      updateFields.surname = surname;
    }
    if (email !== undefined) {
      updateFields.email = email;
    }
    if (address !== undefined) {
      updateFields.address = address;
    }
    if (phoneNumber !== undefined) {
      updateFields.phoneNumber = phoneNumber;
    }
    if (bio !== undefined) {
      updateFields.bio = bio;
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateFields.password = hashedPassword;
      updateFields.confirmPassword = hashedPassword;
    }
    const updateUser = await UserModel.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updateUser) {
      throw new BadRequestError("User not updated");
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updateUser });
  }
);

export const logoutService = asyncHandler(
  async (req: AuthenticatedRequestBody<IUser>, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    const token = await TokenModel.findOne({ refreshToken });
    if (!token) {
      throw new BadRequestError("Invalid token");
    }
    const userId = await verifyRefreshToken(refreshToken);

    if (!userId) {
      throw new BadRequestError("Invalid token userID");
    }

    await TokenModel.deleteOne({ refreshToken });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout successful" });
  }
);

export const refreshTokenWithoutResponse = async (refreshToken: string) => {
  const token = await TokenModel.findOne({ refreshToken });
  if (!token) {
    throw new BadRequestError("Not found refresh token");
  }

  const userId = await verifyRefreshToken(refreshToken);
  if (!userId) {
    throw new BadRequestError("Invalid token userID");
  }

  const generatedAccessToken = await token.generateToken(
    { userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
      audience: String(userId),
    }
  );

  const generatedRefreshToken = await token.generateToken(
    { userId: userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
      audience: String(userId),
    }
  );

  token.accessToken = generatedAccessToken;
  token.refreshToken = generatedRefreshToken;

  await token.save();

  return {
    userId,
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  };
};

export const getAuthProfileService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await UserModel.findById(req.user?._id);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    console.log("User", user);
    res.status(200).json({ user });
    // const user = await UserModel.findById(req.user);
  }
);

import dotenv from "dotenv";
import CategoryModel from "../models/Category.model";
import ProductModel from "../models/Product.model";
dotenv.config();
const App_password = process.env.APP_PASSWORD?.toString();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "hiepma80@gmail.com",
    pass: App_password,
  },
});

const redis = new Redis();
export const sendCodeResetPasswordService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    //Sinh ra 6 số ngẫu nhiên
    const resetPasswordCode = Math.floor(100000 + Math.random() * 900000);
    //Lưu vào redis với thời gian tồn tại là 1 giờ
    if (await redis.get(email)) {
      await redis.del(email);
    }
    await redis.set(email, resetPasswordCode, "EX", 60 * 60);

    await transporter.sendMail({
      from: "hiepma80@gmail.com",
      to: email,
      subject: "Email Reset Password",
      text: "Hãy bảo mật mã này, không chia sẻ cho người khác. Thời gian tồn tại mã là 1 giờ",
      html: `<p>Mã để bạn reset Password: <strong>${resetPasswordCode}</strong></p>`,
    });

    res
      .status(200)
      .json({ message: "Code sent to your email", code: resetPasswordCode });
  }
);

export const verifyCodeResetPasswordService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, code } = req.body;
    if (!email || !code) {
      throw new BadRequestError("Please provide email and code");
    }
    const resetPasswordCode = await redis.get(email);
    console.log("resetPasswordCode", resetPasswordCode);
    if (!resetPasswordCode) {
      throw new BadRequestError("Code is expired");
    }
    if (resetPasswordCode !== code) {
      throw new BadRequestError("Code is not correct");
    }
    res.status(200).json({ message: "Code is correct" });
  }
);

export const updatePasswordWithEmailService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully", user });
  }
);

export const getTotalUsersService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    //đếm role user
    const totalUsers = await UserModel.countDocuments({ role: "user" });
    if (!totalUsers) {
      throw new BadRequestError("No user found");
    }
    res.status(200).json({ message: "thành công", totalUsers: totalUsers });
  }
);

export const getCategoryAndCountProductService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    const categories = await ProductModel.aggregate([
      {
        $group: {
          _id: "$category", // Nhóm theo trường `category`
          productCount: { $sum: 1 }, // Đếm số lượng sản phẩm trong mỗi nhóm
        },
      },
      {
        $project: {
          _id: 0, // Không trả về _id mặc định
          category: "$_id", // Đổi tên `_id` thành `category`
          productCount: 1, // Bao gồm trường `productCount`
        },
      },
    ]);

    if (!categories.length) {
      throw new BadRequestError("No products found");
    }

    res.status(200).json({ message: "Thành công", categories });
  }
);
