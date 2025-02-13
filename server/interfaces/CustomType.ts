import { Request, Response } from "express";
import { IUser } from "./User";
import mongoose from "mongoose";

export interface IAuthRefreshTokenRequest extends Request {
  headers: { authorization?: string; Authorization?: string };
  cookies: { authToken?: string };
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthenticatedRequestBody<T> extends Request {
  body: T;
  user?: IUser;
}

export interface ICartRequest extends Request {
  productId: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
  size: string;
}



export interface IGetProductsRequest extends Request {
  limit: string;
  page: string;
  orderBy: string;
  sortBy: string;
  filterBy: string;
  category: string;
  search: string;
  content: string;
  role: string;
  sort: string;
  fields: string;
}

export interface TPaginationResponse extends Response {
  paginatedResults?: {
    results: any;
    next: string;
    previous: string;
    currentPage: string;
    totalDocs: string;
    totalPages: string;
    lastPage: string;
  };
}
