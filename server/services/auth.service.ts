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

export const signupService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let role = authorizationRoles.user;
    let emailAdmin = process.env.ADMIN_EMAIL as string[] | undefined;

    if (emailAdmin?.includes(req.body.email)) {
      role = authorizationRoles.admin;
    }
    const { name, surname, email, password } = req.body;
    let user = await UserModel.findOne({ email: email });

    if (user) {
      throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
      name,
      surname,
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

    const accessTokenKey = process.env.ACCESS_TOKEN_SECRET as string;
    const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET as string;

    const accessTokenOptions: SignOptions = {
      expiresIn: "15m",
      audience: String(userSaved._id),
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: "7d",
      audience: String(userSaved._id),
    };

    const generatedAccessToken = await token.generateToken(
      payload,
      accessTokenKey,
      accessTokenOptions
    );
    const generatedRefreshToken = await token.generateToken(
      payload,
      refreshTokenKey,
      refreshTokenOptions
    );

    token.accessToken = generatedAccessToken;
    token.refreshToken = generatedRefreshToken;

    token = await token.save();

    const data = {
      user: userSaved,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };

    return res.status(201).json({
      status: "Registration successful",
      data,
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
    req: AuthenticatedRequestBody<ICartUser>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("update service", req.params.userId);
    const { name, surname, email, address, phoneNumber, bio } = req.body;
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
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      updateFields,
      { new: true }
    );

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



