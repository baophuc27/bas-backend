import { Harbor } from '@bas/database/models';
import { NextFunction, Request, Response } from 'express';

export const checkAndCreateHarbor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req;

    if (!orgId) {
      console.warn('[checkAndCreateHarbor] Missing orgId in request');
      return res.status(400).json({ error: 'Missing orgId in request' });
    }

    // Kiểm tra nếu Harbor đã tồn tại cho orgId
    const harborExists = await Harbor.findOne({ where: { orgId } });
    if (!harborExists) {
      console.log(`[checkAndCreateHarbor] Creating default Harbor for orgId: ${orgId}`);
      await Harbor.create({
        orgId,
        name: `Default Harbor for Org ${orgId}`,
        nameEn: `Default Harbor for Org ${orgId}`,
        address: 'Default Address',
        description: 'Default Harbor Description',
      });
    }

    next();
  } catch (error) {
    console.error('[checkAndCreateHarbor] Error:', error);
    next(error);
  }
};
