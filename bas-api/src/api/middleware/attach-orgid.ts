import { Request, Response, NextFunction } from 'express';
import { AsyncContext } from '@bas/utils/AsyncContext';

export const attachOrgId = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.identification) {
      console.warn('[attachOrgId] Missing identification in request');
      return res.status(400).json({ error: 'Missing identification in request' });
    }

    if (!req.identification.orgId) {
      console.warn('[attachOrgId] Missing orgId in identification');
      return res.status(400).json({ error: 'Missing orgId in request identification' });
    }

    // Gắn orgId vào req
    req.orgId = req.identification.orgId;

    // Chuyển đổi permissions từ string thành array (nếu cần)
    const permissionsArray =
      typeof req.identification.permissions === 'string'
        ? req.identification.permissions.split(',').map((perm) => perm.trim())
        : req.identification.permissions;

    // Thiết lập AsyncContext với thông tin hiện tại
    const context = {
      orgId: req.identification.orgId,
      userId: req.identification.userId,
      roleId: req.identification.roleId,
      permissions: permissionsArray, // Chuyển đổi sang mảng
      fullName: req.identification.fullName,
    };
    AsyncContext.setContext(context);

    console.log(`[attachOrgId] orgId attached: ${req.orgId}`);
    next();
  } catch (error) {
    console.error(`[attachOrgId] Error:`, error);
    next(error);
  }
};
