import { Request, Response, NextFunction } from "express";
import {
  getAuthProfileService,
  loginService,
  refreshTokenService,
  signupService,
  testService,
  updateService,
} from "../services/auth.service";
import { Auth } from "mongodb";
import { AuthenticatedRequestBody } from "../interfaces/CustomType";
import { IUser } from "../interfaces/User";

export const signupController = (
  req: Request,
  res: Response,
  next: NextFunction
) => signupService(req, res, next);

export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction
) => loginService(req, res, next);

export const testController = (
  req: Request,
  res: Response,
  next: NextFunction
) => testService(req, res, next);

export const updateController = (
  req: AuthenticatedRequestBody<IUser>,
  res: Response,
  next: NextFunction
) => updateService(req, res, next);

export const logoutController = (
  req: Request,
  res: Response,
  next: NextFunction
) => loginService(req, res, next);

export const refreshTokenController = (
  req: Request,
  res: Response,
  next: NextFunction
) => refreshTokenService(req, res, next);

export const getAuthProfileController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getAuthProfileService(req, res, next);