import { Request, Response } from 'express';
import { IUser } from './User';



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
  