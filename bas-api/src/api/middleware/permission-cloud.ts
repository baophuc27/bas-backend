import { ForbiddenException } from '@bas/exceptions';
import { NextFunction, Request, Response } from 'express';

// Define a custom type for the auth property
interface Auth {
  permissions: string[];
}

// Extend the Request interface to include the auth property
interface AuthenticatedRequest extends Request {
  auth: Auth;
}

export const permissionCloud = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { permissions: userPermissions } = req.auth;
    console.log(userPermissions);
    const isAllow = permissions.some((permission) => userPermissions.includes(permission));
    if (!isAllow) {
      throw new ForbiddenException('Permission denied');
    }
    next();
  };
};
