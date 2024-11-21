import { Request, Response, NextFunction } from 'express';
import { AsyncContext } from '@bas/utils/AsyncContext';

const owner_orgId = 1;

export const attachOrgId = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.identification) {
      console.warn('[attachOrgId] Missing identification in request');
      return res.status(400).json({ error: 'Missing identification in request' });
    }

    if (!req.identification.orgId && req.identification.orgId !== 1) {
      console.warn('[attachOrgId] Missing orgId in identification');
      return res.status(400).json({ error: 'Missing orgId in request identification' });
    }

    req.orgId = req.identification.orgId;

    const permissionsArray =
      typeof req.identification.permissions === 'string'
        ? req.identification.permissions.split(',').map((perm) => perm.trim())
        : req.identification.permissions;

    // Skip AsyncContext for orgId === 1 (global access)
    if (req.identification.orgId !== owner_orgId) {
      const context = {
        orgId: req.identification.orgId,
        userId: req.identification.userId,
        roleId: req.identification.roleId,
        permissions: permissionsArray,
        fullName: req.identification.fullName,
      };
      AsyncContext.setContext(context);
    }

    console.log(`[attachOrgId] orgId attached: ${req.orgId}`);
    next();
  } catch (error) {
    console.error(`[attachOrgId] Error:`, error);
    next(error);
  }
};
