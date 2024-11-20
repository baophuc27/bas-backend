import { Request, Response, NextFunction } from 'express';

export const attachOrgId = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy orgId từ identification và gán vào req.orgId
    if (req.identification && req.identification.orgId) {
      req.orgId = req.identification.orgId;
      req.query.orgId = req.identification.orgId.toString();
      console.log(`[attachOrgId] orgId attached: ${req.orgId}`);
    } else {
      console.warn(`[attachOrgId] orgId not found in identification`);
      throw new Error('Missing orgId in request identification');
    }
    next();
  } catch (error) {
    console.error(`[attachOrgId] Error:`, error);
    next(error);
  }
};
