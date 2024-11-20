import { logError, verifyToken } from '@bas/utils';
import { internalErrorCode } from '@bas/constant';
import { getOneUserById } from '@bas/database/dao/user-dao';
import { NextFunction, Request, Response } from 'express';
import { Forbidden, Unauthorized } from '@bas/api/errors';
import { revokeTokenService } from '@bas/service';

declare module 'express-serve-static-core' {
  interface Request {
    orgId?: number;
    identification: {
      userId: string;
      roleId: number;
      permissions: string;
      fullName: string;
      orgId: number;
      originalId: number;
    };
  }
}

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new Unauthorized('Unauthorized'));
    }

    if (revokeTokenService.isTokenRevoked(token)) {
      return next(new Forbidden('Token revoked', internalErrorCode.TOKEN_EXPIRES));
    }

    const { userId } = verifyToken(token);
    const user = await getOneUserById(userId);

    if (!user) return next(new Unauthorized('Unauthorized'));

    req.identification = {
      userId: user.id,
      permissions: user.permission,
      fullName: user.fullName,
      orgId: user.orgId,
      roleId: user.roleId,
      originalId: user.originalId,
    };

    next();
  } catch (error) {
    logError(error);
    next(new Unauthorized('Token expires', internalErrorCode.TOKEN_EXPIRES));
  }
};
