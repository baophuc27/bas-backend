import { logSuccess } from '@bas/utils/logger';
import { NextFunction, Request, Response } from 'express';
declare module 'express-serve-static-core' {
  interface Response {
    error: (code: number, message: string) => Response;
    success: (data: any, message?: string) => Response;
  }
}

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  res.success = function (data: any, message?: string) {
    logSuccess(message);
    if (data) {
      return res.status(200).json({
        success: true,
        message: message,
        ...data,
      });
    }
    return res.status(200).json({
      success: true,
      message: message,
    });
  };
  next();
};
