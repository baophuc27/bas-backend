import { Harbor } from '@bas/database/models';
import { NextFunction, Request, Response } from 'express';
import { harborDefault } from '@bas/database/master-data';
import { getFromCache } from '@bas/utils/cache';

export const checkAndCreateHarbor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;

    if (!orgId) {
      console.warn('[checkAndCreateHarbor] Missing orgId in request');
      return res.status(400).json({ error: 'Missing orgId in request' });
    }
    const cachedData = await getFromCache(orgId.toString());
    const organization = cachedData;
    console.log(`[checkAndCreateHarbor] Creating default Harbor for orgId: ${orgId}`);
    await Harbor.create(
      {
        name: organization.nameVi || harborDefault.name,
        nameEn: organization.name || harborDefault.nameEn,
        address: organization.address || harborDefault.address,
        description: organization.description || harborDefault.description,
        orgId: orgId,
      },
      {
        where: { orgId },
        returning: true,
      }
    );
    console.log(`Created default harbor for orgId: ${orgId}`);

    next();
  } catch (error) {
    1;
    console.error('[checkAndCreateHarbor] Error:', error);
    next(error);
  }
};
