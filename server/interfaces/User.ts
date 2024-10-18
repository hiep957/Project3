import { Request } from "express";

export interface IUser {
  _id: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  confirmPassword: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
}

export interface IRequestUser extends Request {
  user: IUser;
}

export interface IAuthRequest extends Request {
  headers: { authorization?: string; Authorization?: string };
  cookies: { authToken?: string; accessToken?: string; refreshToken?: string };
  user?: IUser;
}
