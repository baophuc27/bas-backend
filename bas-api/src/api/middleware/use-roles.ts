import { logError } from '@bas/utils';
import { internalErrorCode } from '@bas/constant';
import { NextFunction, Request, Response } from 'express';
import { Forbidden, Unauthorized } from '@bas/api/errors';
import { SystemRole } from '@bas/database/master-data/system-role';
import { BaseError } from '../errors';

export const useRoles = (roles : SystemRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let identification = req.identification;
      if (!identification) {
        return next();
      }
      const defaultRoles = Object.values(SystemRole);
      const isPass = roles.includes(defaultRoles[identification.roleId - 1]);
      if (!isPass) {
        throw new Forbidden('Access denied', internalErrorCode.ACCESS_DENIED);
      }
      next();
    } catch (error) {
      logError(error);
      next(error instanceof  BaseError ? error : new Unauthorized('Access denied', internalErrorCode.ACCESS_DENIED));
    }
  }
}
