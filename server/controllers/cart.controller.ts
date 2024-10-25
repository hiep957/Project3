import { NextFunction, Request, Response } from "express";
import { addToCartService, createCartService } from "../services/cart.service";
import { AuthenticatedRequestBody, ICartRequest } from "../interfaces/CustomType";
import { ICartUser, IUser } from "../interfaces/User";


export const createCartController = async(req: Request, res: Response, next: NextFunction) => createCartService(req, res, next);   
export const addToCartController = async(req: AuthenticatedRequestBody<ICartUser>, res: Response, next: NextFunction) => addToCartService(req, res, next);