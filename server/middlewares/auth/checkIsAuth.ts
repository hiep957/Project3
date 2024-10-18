import { IAuthRequest } from "../../interfaces/User";
import UserModel from "../../models/User.model";
import { BadRequestError, ForbiddenError, InteralServerError } from "../../utils/ApiError";
import asyncHandler from "../../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
export const isAuth = asyncHandler(
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const token = req?.cookies?.accessToken;
    console.log("Params",req.params);
    if (!token) {
      throw new BadRequestError("Not authenticated");
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (err: VerifyErrors| null, decodedUser: any) => {
            if(err) {
                const erorrMessage = err.name === "JsonWebTokenError" ? "Invalid token" : err.message;
                throw new ForbiddenError(erorrMessage);
            }
            try {
                const decodedUserInDB = await UserModel.findOne({ _id: decodedUser?.userId }).select("+password");     
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

export default {isAuth}