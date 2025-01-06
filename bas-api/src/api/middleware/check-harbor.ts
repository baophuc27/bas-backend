import { Harbor } from '@bas/database/models';
import { NextFunction, Request, Response } from 'express';
import { harborDefault } from '@bas/database/master-data';
import { getFromCache } from '@bas/utils/cache';

export const checkAndCreateHarbor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.identification.orgId;
    // Check if harbor already exists
    const existingHarbor = await Harbor.findOne({ where: { orgId } });
    if (existingHarbor) {
      console.log(`[checkAndCreateHarbor] Harbor already exists for orgId: ${orgId}`);
      return next();
    }

    const organization = await getFromCache(orgId.toString());
    console.log('[checkAndCreateHarbor] Organization data:', JSON.stringify(organization, null, 2));

    console.log(`[checkAndCreateHarbor] Creating default Harbor for orgId: ${orgId}`);
    await Harbor.create({
      name: organization.nameVi || harborDefault.name,
      nameEn: organization.name || harborDefault.nameEn,
      address: organization.address || harborDefault.address,
      description: organization.description || harborDefault.description,
      orgId: orgId,
    });
    console.log(`Created default harbor for orgId: ${orgId}`);

    next();
  } catch (error) {
    console.error('[checkAndCreateHarbor] Error:', error);
    next(error);
  }
};
