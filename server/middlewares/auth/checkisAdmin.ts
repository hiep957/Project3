
import { NextFunction, Response } from "express"
import { IAuthRequest as IAdminRequest } from "../../interfaces/User"
import { authorizationRoles } from "../../constants/auth";

export const isAdmin = async(req: IAdminRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    const adminEmails = process.env.ADMIN_EMAIL && (JSON.parse(process.env.ADMIN_EMAIL) as string[]);
    const adminUser = user && user.role === authorizationRoles.admin && adminEmails?.includes(user.email);

    if(!adminUser) {
        return res.status(403).json({ message: "You are not authorized to access this route" });
    }

    next();
}

export default isAdmin;