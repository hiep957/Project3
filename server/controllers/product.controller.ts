import { Request, Response, NextFunction } from "express";
import { getProductService, getProductsService } from "../services/product.service";



export const getProductController = async (req: Request, res: Response, next: NextFunction) => getProductService(req, res, next);

export const getProductsController = async(req: Request, res: Response, next: NextFunction) => getProductsService(req, res, next);  