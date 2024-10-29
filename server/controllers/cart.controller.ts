import { NextFunction, Request, Response } from "express";
import { addToCartService, createCartService, decreaseItemCartService, getCartService } from "../services/cart.service";
import {
  AuthenticatedRequestBody,
  ICartRequest,
} from "../interfaces/CustomType";
import { ICartUser, IUser } from "../interfaces/User";

export const createCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => createCartService(req, res, next);
export const addToCartController = async (
  req: AuthenticatedRequestBody<ICartUser>,
  res: Response,
  next: NextFunction
) => addToCartService(req, res, next);
export const decreaseItemCartController = async (
  req: AuthenticatedRequestBody<ICartUser>,
  res: Response,
  next: NextFunction
) => decreaseItemCartService(req, res, next);

export const getCartController = async(
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
) => getCartService(req, res, next);