import { IAuthRequest } from "../../interfaces/User";
import UserModel from "../../models/User.model";
import { refreshTokenWithoutResponse } from "../../services/auth.service";
import {
  BadRequestError,
  ForbiddenError,
  InteralServerError,
} from "../../utils/ApiError";
import asyncHandler from "../../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError, VerifyErrors } from "jsonwebtoken";
export const isAuth = asyncHandler(
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const token = req?.cookies?.refreshToken;
    console.log("Params", token);
    if (!token) {
      throw new BadRequestError("Not authenticated");
    }
    const accessToken = req?.cookies?.accessToken;
    if (!accessToken) {
      try {
        // Modify refreshTokenService to return the new tokens instead of sending response
        const newTokens = await refreshTokenWithoutResponse(token);

        // Set new cookies
        res.cookie("accessToken", newTokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Update request with new tokens
        req.cookies.accessToken = newTokens.accessToken;
        req.cookies.refreshToken = newTokens.refreshToken;
        console.log("New Access Token", newTokens.accessToken);
      } catch (error) {
        throw new ForbiddenError("Failed to refresh token");
      }
    }


    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (
        err: VerifyErrors | TokenExpiredError | null,
        decodedUser: any
      ) => {
        if (err) {
          const erorrMessage =
            err.name === "JsonWebTokenError" ? "Invalid token" : err.message;
          throw new ForbiddenError(erorrMessage);
        }
        try {
          const decodedUserInDB = await UserModel.findOne({
            _id: decodedUser?.userId,
          }).select("+password");
          if (!decodedUserInDB) {
            throw new ForbiddenError("Invalid token");
          }
          req.user = decodedUserInDB;
          // console.log("Verified User", req.user);
          next();
        } catch (error) {
          throw new InteralServerError("Something went wrong");
        }
      }
    );
  }
);

export default { isAuth };
