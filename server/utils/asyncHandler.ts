import { Request, Response, NextFunction } from 'express';

// Định nghĩa asyncHandler với các kiểu Request, Response và NextFunction
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
