import { NextFunction, Response } from "express";
import { IAuthRequest } from "../../interfaces/User";
import asyncHandler from "../../utils/asyncHandler";

export const customRoles = (
  authorizationEmails: any ,
  role: string
) => {
  return asyncHandler(
    async (req: IAuthRequest, res: Response, next: NextFunction) => {
      const user = req.user;
      console.log("Email:",authorizationEmails);
      const adminEmails =
        authorizationEmails && (JSON.parse(authorizationEmails) as string[]);
      const adminUser =
        user && user.role === role && adminEmails?.includes(user.email);
      console.log("Admin:" ,adminUser)
      if (!adminUser) {
        return res
          .status(403)
          .json({ message: "You are not authorized to access this route" });
      }

      next();
    }
  );
};
