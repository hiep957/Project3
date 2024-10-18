import { NextFunction, Request, Response } from "express";
import {
  adminAddCategoryService,
  adminAddProductService,
  adminAddUserService,
  adminDeleteCategoryService,
  adminUpdateCategoryService,
  adminUpdateProductService,
  adminUpdateUserService,
} from "../services/admin.service";

export const adminAddUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => adminAddUserService(req, res, next);

export const adminUpdateUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => adminUpdateUserService(req, res, next);

export const adminAddCategoryController = (
  req: Request,
  res: Response,
  next: NextFunction
) => adminAddCategoryService(req, res, next);

export const adminUpdateCategoryController = (
  req: Request,
  res: Response,
  next: NextFunction
) => adminUpdateCategoryService(req, res, next);

export const adminDeleteCategoryController = (
  req: Request,
  res: Response,
  next: NextFunction
) => adminDeleteCategoryService(req, res, next);

export const adminGetCategoriesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => adminDeleteCategoryService(req, res, next);

export const adminAddProductController = (
  req: Request,
  res: Response,
  next: NextFunction
) => adminAddProductService(req, res, next);

export const adminUpdateProductController = (
  req: Request,
  res: Response,
  next: NextFunction
) => adminUpdateProductService(req, res, next);
