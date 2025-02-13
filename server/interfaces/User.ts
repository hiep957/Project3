import { Request } from "express";
import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  confirmPassword: string;
  address?: string;
  phoneNumber?: string;
  bio?: string;
  birthDate?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
}

export interface ICartUser extends IUser {
  productId: mongoose.Schema.Types.ObjectId;
  price: number;
  quantity: number;
  size: string;
  orderCode?: number;
}

export interface IRequestUser extends Request {
  user: IUser;
}

export interface IPaymentRequest extends IUser {
  page: number;
  limit: number;
}

export interface IAuthRequest extends Request {
  headers: { authorization?: string; Authorization?: string };
  cookies: { authToken?: string; accessToken?: string; refreshToken?: string };
  user?: IUser;
}
