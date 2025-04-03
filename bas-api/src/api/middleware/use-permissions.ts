import { logError } from '@bas/utils';
import { internalErrorCode } from '@bas/constant';
import { NextFunction, Request, Response } from 'express';
import { Forbidden, Unauthorized } from '@bas/api/errors';
import { SystemRole } from '@bas/database/master-data';
import { roleMatrix } from '@bas/constant/role-matrix';

const roleMap = {
  [SystemRole.ADMIN]: 8,
  [SystemRole.CONFIGURE]: 9,
  [SystemRole.VIEW]: 10,
};

export const usePermissions = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roleId } = req.identification || {};

      if (!roleId) {
        throw new Unauthorized('Missing role identification', internalErrorCode.ACCESS_DENIED);
      }

      // Find the SystemRole based on roleId from roleMap
      const systemRole = Object.keys(roleMap).find(
        (key) => roleMap[key as SystemRole] === roleId
      ) as SystemRole;

      if (!systemRole) {
        throw new Forbidden(`Invalid roleId: ${roleId}`, internalErrorCode.FORBIDDEN);
      }

      // Retrieve permissions for the identified systemRole
      const userPermissions = roleMatrix[systemRole];
      if (!userPermissions) {
        throw new Forbidden(
          `Permissions not found for role: ${systemRole}`,
          internalErrorCode.FORBIDDEN
        );
      }
      const isAuthorized = requiredPermissions.some((perm) => userPermissions.includes(perm));

      if (!isAuthorized) {
        throw new Forbidden('Access denied. Insufficient permissions', internalErrorCode.FORBIDDEN);
      }

      next();
    } catch (error: any) {
      logError(error);
      next(new Forbidden(error.message, error.status || internalErrorCode.FORBIDDEN));
    }
  };
};
